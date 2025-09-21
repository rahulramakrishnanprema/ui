import React from 'react';
import { Clock, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ActivityLog as ActivityLogType } from '../types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityLogProps {
  logs: ActivityLogType[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">Activity Log</h3>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`border-l-4 p-3 rounded-r-lg ${getStatusColor(log.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(log.status)}
                    <span className="font-medium text-slate-900">{log.agent}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-medium text-slate-900">{log.action}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-1">{log.details}</p>
                  {log.issueId && (
                    <span className="inline-block bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded">
                      {log.issueId}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 ml-3">
                  {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};