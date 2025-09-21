import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface SystemStatusProps {
  isConnected: boolean;
  isSystemRunning: boolean;
  error?: string | null;
  agentsReady?: {
    task_agent: boolean;
    developer_agent: boolean;
    reviewer_agent: boolean;
    rebuilder_agent: boolean;
    jira_client: boolean;
  };
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  isConnected,
  isSystemRunning,
  error,
  agentsReady
}) => {
  const getConnectionStatus = () => {
    if (!isConnected) {
      return {
        icon: <WifiOff className="w-5 h-5 text-red-600" />,
        text: 'Disconnected',
        color: 'bg-red-50 border-red-200 text-red-800'
      };
    }
    
    if (isSystemRunning) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        text: 'Connected & Running',
        color: 'bg-green-50 border-green-200 text-green-800'
      };
    }
    
    return {
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      text: 'Connected (Idle)',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
  };

  const status = getConnectionStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 border ${status.color}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status.icon}
          <div>
            <h3 className="font-medium">{status.text}</h3>
            {error && (
              <p className="text-sm opacity-75 mt-1">{error}</p>
            )}
          </div>
        </div>
        
        {agentsReady && isConnected && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Agents:</span>
            <div className="flex gap-1">
              {Object.entries(agentsReady).map(([agent, ready]) => (
                <div
                  key={agent}
                  className={`w-3 h-3 rounded-full ${
                    ready ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={`${agent}: ${ready ? 'Ready' : 'Not Ready'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};