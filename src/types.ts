export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: number;
  user: User;
  text: string;
  timestamp: string;
  keywords?: string[];
}

export interface GraphNode {
  id: string;
  size: number;
  x: number;
  y: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface Task {
  id: number;
  text: string;
  assignedTo: string;
  completed: boolean;
}
