export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastActivity: Date;
  tasksProcessed: number;
  llmModel: string;
  tokensConsumed: number;
}

export interface JiraIssue {
  id: string;
  key: string;
  title: string;
  status: 'in-progress' | 'pending' | 'completed' | 'failed';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeReview {
  id: string;
  issueId: string;
  score: number;
  status: 'passed' | 'failed' | 'pending';
  sonarQubeScore: number;
  feedback: string;
  reviewedAt: Date;
  rebuilds: number;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  agent: string;
  action: string;
  details: string;
  status: 'info' | 'success' | 'warning' | 'error';
  issueId?: string;
}

export interface Metrics {
  totalPullRequests: number;
  tokensUsed: number;
  tasksCompleted: number;
  tasksFailed: number;
  averageSonarQubeScore: number;
  successRate: number;
}

export interface PerformanceData {
  date: string;
  tasks: number;
  tokens: number;
  pullRequests: number;
  sonarScore: number;
}

export interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'number';
  placeholder: string;
  required: boolean;
  description?: string;
}