import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Agent } from '../types/dashboard';

interface AgentPerformanceChartsProps {
  agents: Agent[];
}

export const AgentPerformanceCharts: React.FC<AgentPerformanceChartsProps> = ({ agents }) => {
  // Prepare data for different chart types
  const agentTaskData = agents.map(agent => ({
    name: agent.name.replace('Agent', ''),
    tasks: agent.tasksProcessed,
    tokens: Math.round(agent.tokensConsumed / 1000), // Convert to K
    efficiency: Math.round((agent.tasksProcessed / (agent.tokensConsumed / 1000)) * 100) / 100
  }));

  const agentTokenData = agents.map(agent => ({
    name: agent.name.replace('Agent', ''),
    tokens: agent.tokensConsumed,
    model: agent.llmModel
  }));

  const radarData = agents.map(agent => ({
    agent: agent.name.replace('Agent', ''),
    tasks: agent.tasksProcessed,
    tokens: Math.round(agent.tokensConsumed / 10000), // Scale down for radar
    efficiency: Math.round((agent.tasksProcessed / (agent.tokensConsumed / 1000)) * 10),
    uptime: agent.status === 'active' ? 100 : 0
  }));

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const formatTokens = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Agent Task Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Task Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agentTaskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#3B82F6" name="Tasks Processed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Token Consumption by Agent */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Token Consumption by Agent</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agentTokenData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatTokens} />
            <Tooltip formatter={(value) => [formatTokens(Number(value)), 'Tokens']} />
            <Bar dataKey="tokens" name="Tokens Consumed">
              {agentTokenData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Efficiency Comparison */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Efficiency (Tasks per 1K Tokens)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={agentTaskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Performance Radar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Performance Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="agent" />
            <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
            <Radar
              name="Tasks"
              dataKey="tasks"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              name="Efficiency"
              dataKey="efficiency"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Model Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">LLM Model Usage by Agent</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <div key={agent.id} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {agent.name.replace('Agent', '')}
              </div>
              <div className="text-sm text-slate-600 mb-2">{agent.llmModel}</div>
              <div className="text-lg font-semibold" style={{ color: colors[index % colors.length] }}>
                {formatTokens(agent.tokensConsumed)}
              </div>
              <div className="text-xs text-slate-500">tokens used</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};