// src/services/api.ts
const API_BASE_URL = 'http://localhost:8080/api';  // Changed from 3000 to 8080

export const api = {
  async getStatus() {
    const response = await fetch(`${API_BASE_URL}/status`);
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  },

  async getActivity() {
    const response = await fetch(`${API_BASE_URL}/activity`);
    return response.json();
  },

  async getConfig() {
    const response = await fetch(`${API_BASE_URL}/config`);
    return response.json();
  },

  async startAutomation(projectKey: string) {
    const response = await fetch(`${API_BASE_URL}/start-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_key: projectKey }),
    });
    return response.json();
  },

  async resetStats() {
    const response = await fetch(`${API_BASE_URL}/reset-stats`, {
      method: 'POST',
    });
    return response.json();
  },
};