import { createContext } from 'react';
import type { User } from '../types';

export interface AppContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
