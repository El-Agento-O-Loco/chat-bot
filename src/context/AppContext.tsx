import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { USERS } from '../constants';

interface AppContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and provides shared state
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<User>(USERS[0]);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Custom hook to use the app context
 * @throws Error if used outside of AppProvider
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
