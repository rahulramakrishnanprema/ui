import React from 'react';
import { Bot } from 'lucide-react';
import { Agent } from '../types/dashboard';
import { motion } from 'framer-motion';

interface AgentPerformanceCardProps {
  agent: Agent;
}

export const AgentPerformanceCard: React.FC<AgentPerformanceCardProps> = ({ agent }) => {
  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Bot className="w-5 h-5 text-slate-700" />
        </div>
        <h3 className="font-semibold text-slate-900">{agent.name}</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <span className="text-sm text-slate-600">LLM Model:</span>
          <p className="font-medium text-slate-900 mt-1">{agent.llmModel}</p>
        </div>
        <div>
          <span className="text-sm text-slate-600">Tokens Consumed:</span>
          <p className="font-medium text-slate-900 mt-1">{formatTokens(agent.tokensConsumed)}</p>
        </div>
      </div>
    </motion.div>
  );
};