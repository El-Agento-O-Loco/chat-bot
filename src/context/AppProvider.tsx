import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './AppContext';
import { USERS } from '../constants';

/**
 * Provider component that wraps the app and provides shared state
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState(USERS[0]);

  return (
    <AppContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </AppContext.Provider>
  );
}
