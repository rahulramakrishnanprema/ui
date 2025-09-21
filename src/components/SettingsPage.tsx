import React, { useState } from 'react';
import { Save, Database, Cloud, Github, Settings as SettingsIcon, Key, Server, BarChart3, Pocket as Docker, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfigField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'number';
  placeholder: string;
  required: boolean;
  description?: string;
}

interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: ConfigField[];
}

export const SettingsPage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const configSections: ConfigSection[] = [
    {
      id: 'jira',
      title: 'Jira Configuration',
      description: 'Connect to your Jira instance for issue management',
      icon: SettingsIcon,
      color: 'bg-blue-600',
      fields: [
        { key: 'JIRA_URL', label: 'Jira Server URL', type: 'url', placeholder: 'https://your-company.atlassian.net', required: true },
        { key: 'JIRA_USERNAME', label: 'Username/Email', type: 'text', placeholder: 'user@company.com', required: true },
        { key: 'JIRA_API_TOKEN', label: 'API Token', type: 'password', placeholder: 'Your Jira API token', required: true },
        { key: 'JIRA_PROJECT_KEY', label: 'Project Key', type: 'text', placeholder: 'PROJ', required: true }
      ]
    },
    {
      id: 'github',
      title: 'GitHub Configuration',
      description: 'Configure GitHub integration for repository management',
      icon: Github,
      color: 'bg-gray-800',
      fields: [
        { key: 'GITHUB_TOKEN', label: 'Personal Access Token', type: 'password', placeholder: 'ghp_xxxxxxxxxxxx', required: true },
        { key: 'GITHUB_OWNER', label: 'Repository Owner', type: 'text', placeholder: 'your-organization', required: true },
        { key: 'GITHUB_REPO', label: 'Repository Name', type: 'text', placeholder: 'your-repo', required: true },
        { key: 'GITHUB_BRANCH', label: 'Default Branch', type: 'text', placeholder: 'main', required: false }
      ]
    },
    {
      id: 'mongodb',
      title: 'MongoDB Atlas',
      description: 'Database configuration for data storage',
      icon: Database,
      color: 'bg-green-600',
      fields: [
        { key: 'MONGODB_URI', label: 'Connection String', type: 'password', placeholder: 'mongodb+srv://username:password@cluster.mongodb.net/', required: true },
        { key: 'MONGODB_DATABASE', label: 'Database Name', type: 'text', placeholder: 'aristotlei', required: true }
      ]
    },
    {
      id: 'postgres',
      title: 'PostgreSQL',
      description: 'Relational database configuration',
      icon: Database,
      color: 'bg-blue-700',
      fields: [
        { key: 'POSTGRES_HOST', label: 'Host', type: 'text', placeholder: 'localhost', required: true },
        { key: 'POSTGRES_PORT', label: 'Port', type: 'number', placeholder: '5432', required: true },
        { key: 'POSTGRES_DATABASE', label: 'Database', type: 'text', placeholder: 'aristotlei', required: true },
        { key: 'POSTGRES_USERNAME', label: 'Username', type: 'text', placeholder: 'postgres', required: true },
        { key: 'POSTGRES_PASSWORD', label: 'Password', type: 'password', placeholder: 'your-password', required: true }
      ]
    },
    {
      id: 'docker',
      title: 'Docker Configuration',
      description: 'Container orchestration settings',
      icon: Docker,
      color: 'bg-blue-500',
      fields: [
        { key: 'DOCKER_REGISTRY', label: 'Registry URL', type: 'url', placeholder: 'https://registry.hub.docker.com', required: false },
        { key: 'DOCKER_USERNAME', label: 'Username', type: 'text', placeholder: 'your-username', required: false },
        { key: 'DOCKER_PASSWORD', label: 'Password/Token', type: 'password', placeholder: 'your-password', required: false }
      ]
    },
    {
      id: 'aws',
      title: 'AWS Configuration',
      description: 'Amazon Web Services integration',
      icon: Cloud,
      color: 'bg-orange-500',
      fields: [
        { key: 'AWS_ACCESS_KEY_ID', label: 'Access Key ID', type: 'password', placeholder: 'AKIAIOSFODNN7EXAMPLE', required: true },
        { key: 'AWS_SECRET_ACCESS_KEY', label: 'Secret Access Key', type: 'password', placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', required: true },
        { key: 'AWS_REGION', label: 'Region', type: 'text', placeholder: 'us-east-1', required: true },
        { key: 'AWS_S3_BUCKET', label: 'S3 Bucket', type: 'text', placeholder: 'your-bucket-name', required: false }
      ]
    },
    {
      id: 'gcp',
      title: 'Google Cloud Platform',
      description: 'GCP services configuration',
      icon: Cloud,
      color: 'bg-red-500',
      fields: [
        { key: 'GCP_PROJECT_ID', label: 'Project ID', type: 'text', placeholder: 'your-project-id', required: true },
        { key: 'GCP_SERVICE_ACCOUNT_KEY', label: 'Service Account Key (JSON)', type: 'password', placeholder: 'Paste your service account JSON here', required: true },
        { key: 'GCP_REGION', label: 'Region', type: 'text', placeholder: 'us-central1', required: true }
      ]
    },
    {
      id: 'openrouter',
      title: 'OpenRouter AI',
      description: 'AI model routing and API configuration',
      icon: Zap,
      color: 'bg-purple-600',
      fields: [
        { key: 'OPENROUTER_API_KEY', label: 'API Key', type: 'password', placeholder: 'sk-or-v1-xxxxxxxxxxxx', required: true },
        { key: 'OPENROUTER_MODEL', label: 'Default Model', type: 'text', placeholder: 'anthropic/claude-3-sonnet', required: true },
        { key: 'OPENROUTER_MAX_TOKENS', label: 'Max Tokens', type: 'number', placeholder: '4000', required: false }
      ]
    }
  ];

  const handleInputChange = (key: string, value: string) => {
    setConfigs(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveStatus('idle');

    try {
      // Simulate API call to update .env file
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make an actual API call to your backend
      // const response = await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(configs)
      // });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getSaveButtonContent = () => {
    if (saving) return 'Saving...';
    if (saveStatus === 'success') return 'Saved Successfully!';
    if (saveStatus === 'error') return 'Save Failed';
    return 'Save All Settings';
  };

  const getSaveButtonIcon = () => {
    if (saving) return <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />;
    if (saveStatus === 'success') return <CheckCircle className="w-5 h-5" />;
    if (saveStatus === 'error') return <AlertCircle className="w-5 h-5" />;
    return <Save className="w-5 h-5" />;
  };

  const getSaveButtonColor = () => {
    if (saveStatus === 'success') return 'bg-green-600 hover:bg-green-700';
    if (saveStatus === 'error') return 'bg-red-600 hover:bg-red-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuration Settings</h1>
          <p className="text-slate-600">Configure your integrations and services</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveSettings}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all ${getSaveButtonColor()} disabled:opacity-50`}
        >
          {getSaveButtonIcon()}
          {getSaveButtonContent()}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {configSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${section.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-600">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={configs[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                    {field.description && (
                      <p className="text-xs text-slate-500 mt-1">{field.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};