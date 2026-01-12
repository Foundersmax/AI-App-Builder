
import { WebsiteState } from "../types";

// In production, /api is proxied via vercel.json to your Render URL.
// In development, this relies on your local dev server or manual URL setting.
const API_BASE_URL = '/api';

export const generateWebsite = async (prompt: string): Promise<WebsiteState> => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate website');
  }
  return response.json();
};

export const refineWebsite = async (currentSite: WebsiteState, instruction: string): Promise<WebsiteState> => {
  const response = await fetch(`${API_BASE_URL}/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentSite, instruction }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to refine website');
  }
  return response.json();
};

export const saveWebsite = async (site: WebsiteState): Promise<WebsiteState> => {
  const response = await fetch(`${API_BASE_URL}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(site),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save website');
  }
  return response.json();
};

export const loadSites = async (): Promise<WebsiteState[]> => {
  const response = await fetch(`${API_BASE_URL}/sites`);
  if (!response.ok) throw new Error('Failed to load sites');
  return response.json();
};
