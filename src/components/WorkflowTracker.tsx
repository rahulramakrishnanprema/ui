import React from 'react';
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { JiraIssue } from '../types/dashboard';
import { motion } from 'framer-motion';

interface WorkflowTrackerProps {
  currentIssue: JiraIssue | null;
  workflowStage: string;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  currentIssue,
  workflowStage
}) => {
  const stages = [
    { id: 'task-fetch', name: 'Task Fetching', agent: 'TaskAgent' },
    { id: 'code-generation', name: 'Code Generation', agent: 'DeveloperAgent' },
    { id: 'code-review', name: 'Code Review', agent: 'ReviewerAgent' },
    { id: 'code-rebuild', name: 'Code Rebuild', agent: 'RebuilderAgent' },
    { id: 'pr-creation', name: 'PR Creation', agent: 'TaskAgent' }
  ];

  const getStageStatus = (stageId: string) => {
    const currentIndex = stages.findIndex(s => s.id === workflowStage);
    const stageIndex = stages.findIndex(s => s.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active': return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <div className="w-5 h-5 bg-slate-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'active': return 'border-blue-200 bg-blue-50';
      case 'failed': return 'border-red-200 bg-red-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Workflow Status</h3>
      
      {currentIssue && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">{currentIssue.key}</h4>
              <p className="text-sm text-slate-600">{currentIssue.title}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                currentIssue.status === 'completed' ? 'bg-green-100 text-green-800' :
                currentIssue.status === 'failed' ? 'bg-red-100 text-red-800' :
                currentIssue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {currentIssue.status}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Priority: {currentIssue.priority}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${getStatusColor(status)}`}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(status)}
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{stage.name}</h4>
                  <p className="text-sm text-slate-600">{stage.agent}</p>
                </div>
                {index < stages.length - 1 && status === 'completed' && (
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};