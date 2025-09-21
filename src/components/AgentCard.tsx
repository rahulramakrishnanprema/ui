import React from 'react';
import { Bot, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Agent } from '../types/dashboard';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const getStatusColor = () => {
    switch (agent.status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-slate-500';
    }
  };

  const getStatusIcon = () => {
    switch (agent.status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <Clock className="w-4 h-4 text-red-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Bot className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{agent.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              {getStatusIcon()}
              <span className="text-sm text-slate-600 capitalize">{agent.status}</span>
            </div>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tasks Processed:</span>
          <span className="font-medium text-slate-900">{agent.tasksProcessed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Last Activity:</span>
          <span className="font-medium text-slate-900">
            {agent.lastActivity.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};