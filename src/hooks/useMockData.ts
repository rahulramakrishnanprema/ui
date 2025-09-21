import { useState, useEffect } from 'react';
import { Agent, JiraIssue, ActivityLog, Metrics, PerformanceData } from '../types/dashboard';

export const useMockData = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'TaskAgent',
      status: 'active',
      lastActivity: new Date(),
      tasksProcessed: 42,
      llmModel: 'GPT-4',
      tokensConsumed: 125430
    },
    {
      id: '2',
      name: 'DeveloperAgent',
      status: 'active',
      lastActivity: new Date(Date.now() - 2 * 60 * 1000),
      tasksProcessed: 38,
      llmModel: 'Claude-3-Sonnet',
      tokensConsumed: 287650
    },
    {
      id: '3',
      name: 'ReviewerAgent',
      status: 'inactive',
      lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      tasksProcessed: 31,
      llmModel: 'GPT-4-Turbo',
      tokensConsumed: 198720
    },
    {
      id: '4',
      name: 'RebuilderAgent',
      status: 'active',
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      tasksProcessed: 12,
      llmModel: 'Claude-3-Haiku',
      tokensConsumed: 89340
    }
  ]);

  const [currentIssue] = useState<JiraIssue>({
    id: '1',
    key: 'PROJ-1234',
    title: 'Implement user authentication service',
    status: 'in-progress',
    assignee: 'john.doe@company.com',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date()
  });

  const [workflowStage, setWorkflowStage] = useState('code-generation');

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: new Date(),
      agent: 'DeveloperAgent',
      action: 'Code Generation',
      details: 'Generated authentication service with JWT implementation',
      status: 'success',
      issueId: 'PROJ-1234'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      agent: 'TaskAgent',
      action: 'Issue Fetched',
      details: 'Successfully fetched issue from Jira API',
      status: 'success',
      issueId: 'PROJ-1234'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      agent: 'ReviewerAgent',
      action: 'Code Review',
      details: 'Code review failed - security vulnerabilities detected',
      status: 'error',
      issueId: 'PROJ-1233'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      agent: 'RebuilderAgent',
      action: 'Code Rebuild',
      details: 'Rebuilt code with security fixes applied',
      status: 'success',
      issueId: 'PROJ-1233'
    }
  ]);

  const [metrics] = useState<Metrics>({
    totalPullRequests: 156,
    tokensUsed: 2847392,
    tasksCompleted: 89,
    tasksFailed: 12,
    averageSonarQubeScore: 87.3,
    successRate: 88.1
  });

  const [performanceData] = useState<PerformanceData[]>([
    { date: '2024-01-01', tasks: 12, tokens: 45000, pullRequests: 8, sonarScore: 85 },
    { date: '2024-01-02', tasks: 15, tokens: 52000, pullRequests: 12, sonarScore: 87 },
    { date: '2024-01-03', tasks: 18, tokens: 48000, pullRequests: 15, sonarScore: 89 },
    { date: '2024-01-04', tasks: 14, tokens: 51000, pullRequests: 11, sonarScore: 86 },
    { date: '2024-01-05', tasks: 20, tokens: 58000, pullRequests: 18, sonarScore: 91 },
    { date: '2024-01-06', tasks: 16, tokens: 49000, pullRequests: 13, sonarScore: 88 },
    { date: '2024-01-07', tasks: 22, tokens: 61000, pullRequests: 19, sonarScore: 90 }
  ]);

  const [isSystemRunning, setIsSystemRunning] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSystemRunning) {
        // Update agent activity
        setAgents(prev => prev.map(agent => ({
          ...agent,
          lastActivity: new Date(),
          tasksProcessed: agent.tasksProcessed + Math.floor(Math.random() * 2)
        })));

        // Add new activity log
        const actions = [
          'Processing task',
          'Generating code',
          'Reviewing code',
          'Creating PR',
          'Rebuilding code'
        ];
        const statuses = ['success', 'info', 'warning'] as const;
        
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          agent: agents[Math.floor(Math.random() * agents.length)].name,
          action: actions[Math.floor(Math.random() * actions.length)],
          details: 'Automated system activity',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          issueId: Math.random() > 0.5 ? 'PROJ-1234' : undefined
        };

        setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isSystemRunning, agents]);

  const startSystem = () => {
    setIsSystemRunning(true);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'active' as const,
      lastActivity: new Date()
    })));
  };

  const stopSystem = () => {
    setIsSystemRunning(false);
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: Math.random() > 0.3 ? 'active' as const : 'inactive' as const
    })));
  };

  return {
    agents,
    currentIssue,
    workflowStage,
    activityLogs,
    metrics,
    performanceData,
    isSystemRunning,
    startSystem,
    stopSystem
  };
};