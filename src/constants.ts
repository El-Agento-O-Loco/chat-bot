import type { User } from './types';
import anasAvatar from './assets/anas.png';
import sergioAvatar from './assets/sergio.png';
import rupeshAvatar from './assets/rupesh.png';

export const USERS: User[] = [
  { id: 'u1', name: 'Dev Lead', color: 'bg-blue-600', avatar: anasAvatar },
  { id: 'u2', name: 'Stakeholder', color: 'bg-emerald-600', avatar: sergioAvatar },
  { id: 'u3', name: 'Data Scientist', color: 'bg-purple-600', avatar: rupeshAvatar },
];

export const AI_AGENT: User = { id: 'ai', name: 'Omni', color: 'bg-slate-700' };

export const KEYWORDS = [
  "Optimization", "Deployment", "Budget", "API", "Latency", "Model",
  "GPU", "Dataset", "Stakeholder", "Timeline", "Blocker", "Security"
];
