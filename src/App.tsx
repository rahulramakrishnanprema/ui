import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  GitPullRequest, 
  Zap, 
  CheckCircle, 
  XCircle,
  TrendingUp
} from 'lucide-react';

import { Sidebar } from './components/Sidebar';
import { MetricCard } from './components/MetricCard';
import { AgentCard } from './components/AgentCard';
import { AgentPerformanceCard } from './components/AgentPerformanceCard';
import { ActivityLog } from './components/ActivityLog';
import { WorkflowTracker } from './components/WorkflowTracker';
import { PerformanceCharts } from './components/PerformanceCharts';
import { AgentPerformanceCharts } from './components/AgentPerformanceCharts';
import { SettingsPage } from './components/SettingsPage';
import { useMockData } from './hooks/useMockData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    agents,
    currentIssue,
    workflowStage,
    activityLogs,
    metrics,
    performanceData,
    isSystemRunning,
    startSystem,
    stopSystem
  } = useMockData();

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* System Control */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Monitor your automated Jira to GitHub workflow</p>
              </div>
              <button
                onClick={isSystemRunning ? stopSystem : startSystem}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSystemRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isSystemRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Stop System
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start System
                  </>
                )}
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <MetricCard
                title="Pull Requests"
                value={metrics.totalPullRequests}
                //change="+12%"
                changeType="positive"
                icon={GitPullRequest}
                color="bg-blue-600"
              />
              <MetricCard
                title="Tokens Used"
                value={`${(metrics.tokensUsed / 1000000).toFixed(1)}M`}
                //change="+8%"
                changeType="positive"
                icon={Zap}
                color="bg-purple-600"
              />
              <MetricCard
                title="Tasks Completed"
                value={metrics.tasksCompleted}
                //change="+15%"
                changeType="positive"
                icon={CheckCircle}
                color="bg-green-600"
              />
              <MetricCard
                title="Tasks Failed"
                value={metrics.tasksFailed}
                //change="-5%"
                changeType="positive"
                icon={XCircle}
                color="bg-red-600"
              />
              <MetricCard
                title="SonarQube Score"
                value={`${metrics.averageSonarQubeScore}%`}
                //change="+3%"
                changeType="positive"
                icon={TrendingUp}
                color="bg-yellow-600"
              />
            </div>

            {/* Workflow and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WorkflowTracker
                currentIssue={currentIssue}
                workflowStage={workflowStage}
              />
              <ActivityLog logs={activityLogs} />
            </div>
          </div>
        );

      case 'agents':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agent Status</h1>
              <p className="text-slate-600">Monitor the health and activity of your backend agents</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Health Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {agents.filter(a => a.status === 'active').length}
                  </div>
                  <div className="text-sm text-slate-600">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {agents.filter(a => a.status === 'inactive').length}
                  </div>
                  <div className="text-sm text-slate-600">Inactive Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {agents.reduce((sum, agent) => sum + agent.tasksProcessed, 0)}
                  </div>
                  <div className="text-sm text-slate-600">Total Tasks Processed</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Agent Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {agents.map((agent) => (
                  <AgentPerformanceCard key={`performance-${agent.id}`} agent={agent} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Performance Metrics</h1>
              <p className="text-slate-600">Analyze system performance and code quality trends</p>
            </div>
            
            <PerformanceCharts
              data={performanceData}
              successRate={metrics.successRate}
              failureRate={100 - metrics.successRate}
            />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Agent Performance Analytics</h2>
              <AgentPerformanceCharts agents={agents} />
            </div>
          </div>
        );

      case 'settings':
        return (
          <SettingsPage />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;