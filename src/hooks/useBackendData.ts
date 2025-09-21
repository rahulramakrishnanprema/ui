import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Agent, JiraIssue, ActivityLog, Metrics, PerformanceData } from '../types/dashboard';

interface BackendStatus {
  system_status: string;
  active_issues: number;
  queue_size: number;
  running_tasks: number;
  agents_ready: {
    task_agent: boolean;
    developer_agent: boolean;
    reviewer_agent: boolean;
    rebuilder_agent: boolean;
    jira_client: boolean;
  };
  configuration: {
    model: string;
    mcp_endpoint: string;
    project_key: string;
    review_threshold: number;
  };
  current_stage: string;
  system_running: boolean;
  timestamp: string;
}

interface BackendStats {
  totalPullRequests: number;
  prAccepted: number;
  tokensUsed: number;
  tasksCompleted: number;
  tasksFailed: number;
  tasksPending: number;
  tasksMovedToHITL: number;
  averageSonarQubeScore: number;
  successRate: number;
  task_agent_generations: number;
  developer_generations: number;
  reviewer_generations: number;
  rebuilder_generations: number;
  last_updated: string;
  system_status: string;
}

interface BackendActivity {
  activity: Array<{
    id: string;
    timestamp: string;
    agent: string;
    action: string;
    details: string;
    status: 'info' | 'success' | 'warning' | 'error';
    issueId?: string;
  }>;
}

export const useBackendData = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [currentIssue, setCurrentIssue] = useState<JiraIssue | null>(null);
  const [workflowStage, setWorkflowStage] = useState('task-fetch');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalPullRequests: 0,
    tokensUsed: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    averageSonarQubeScore: 0,
    successRate: 0
  });
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch system status
  const fetchStatus = useCallback(async () => {
    try {
      const status: BackendStatus = await api.getStatus();
      setIsConnected(true);
      setIsSystemRunning(status.system_running);
      setWorkflowStage(status.current_stage);
      setError(null);

      // Convert backend agents to UI format
      const backendAgents: Agent[] = [
        {
          id: '1',
          name: 'TaskAgent',
          status: status.agents_ready.task_agent ? 'active' : 'inactive',
          lastActivity: new Date(),
          tasksProcessed: 0,
          llmModel: status.configuration.model,
          tokensConsumed: 0
        },
        {
          id: '2',
          name: 'DeveloperAgent',
          status: status.agents_ready.developer_agent ? 'active' : 'inactive',
          lastActivity: new Date(),
          tasksProcessed: 0,
          llmModel: status.configuration.model,
          tokensConsumed: 0
        },
        {
          id: '3',
          name: 'ReviewerAgent',
          status: status.agents_ready.reviewer_agent ? 'active' : 'inactive',
          lastActivity: new Date(),
          tasksProcessed: 0,
          llmModel: status.configuration.model,
          tokensConsumed: 0
        },
        {
          id: '4',
          name: 'RebuilderAgent',
          status: status.agents_ready.rebuilder_agent ? 'active' : 'inactive',
          lastActivity: new Date(),
          tasksProcessed: 0,
          llmModel: status.configuration.model,
          tokensConsumed: 0
        }
      ];
      setAgents(backendAgents);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
      setIsConnected(false);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const stats: BackendStats = await api.getStats();
      
      setMetrics({
        totalPullRequests: stats.totalPullRequests,
        tokensUsed: stats.tokensUsed,
        tasksCompleted: stats.tasksCompleted,
        tasksFailed: stats.tasksFailed,
        averageSonarQubeScore: stats.averageSonarQubeScore,
        successRate: stats.successRate
      });

      // Update agents with token consumption data
      setAgents(prev => prev.map((agent, index) => ({
        ...agent,
        tokensConsumed: [
          stats.task_agent_generations,
          stats.developer_generations,
          stats.reviewer_generations,
          stats.rebuilder_generations
        ][index] * 1000 || 0,
        tasksProcessed: Math.floor(stats.tasksCompleted / 4) + (index * 2)
      })));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  // Fetch activity logs
  const fetchActivity = useCallback(async () => {
    try {
      const activityData: BackendActivity = await api.getActivity();
      
      const formattedLogs: ActivityLog[] = activityData.activity.map(activity => ({
        id: activity.id,
        timestamp: new Date(activity.timestamp),
        agent: activity.agent,
        action: activity.action,
        details: activity.details,
        status: activity.status,
        issueId: activity.issueId
      }));

      setActivityLogs(formattedLogs);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
    }
  }, []);

  // Generate mock performance data (since backend doesn't provide this yet)
  const generatePerformanceData = useCallback(() => {
    const data: PerformanceData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        tasks: Math.floor(Math.random() * 20) + 10,
        tokens: Math.floor(Math.random() * 50000) + 30000,
        pullRequests: Math.floor(Math.random() * 15) + 5,
        sonarScore: Math.floor(Math.random() * 20) + 80
      });
    }
    
    setPerformanceData(data);
  }, []);

  // Start system
  const startSystem = useCallback(async (projectKey?: string) => {
    try {
      const result = await api.startAutomation(projectKey || 'DEFAULT');
      setIsSystemRunning(true);
      setError(null);
      
      // Refresh data after starting
      await Promise.all([fetchStatus(), fetchStats(), fetchActivity()]);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start system');
      throw err;
    }
  }, [fetchStatus, fetchStats, fetchActivity]);

  // Stop system (placeholder - backend doesn't have stop endpoint yet)
  const stopSystem = useCallback(async () => {
    setIsSystemRunning(false);
    // In a real implementation, you'd call a stop endpoint
  }, []);

  // Reset statistics
  const resetStats = useCallback(async () => {
    try {
      await api.resetStats();
      await fetchStats();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset stats');
      throw err;
    }
  }, [fetchStats]);

  // Initial data fetch and polling
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchStatus(),
        fetchStats(),
        fetchActivity()
      ]);
      generatePerformanceData();
    };

    fetchAllData();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchAllData, 5000);

    return () => clearInterval(interval);
  }, [fetchStatus, fetchStats, fetchActivity, generatePerformanceData]);

  return {
    agents,
    currentIssue,
    workflowStage,
    activityLogs,
    metrics,
    performanceData,
    isSystemRunning,
    isConnected,
    error,
    startSystem,
    stopSystem,
    resetStats
  };
};