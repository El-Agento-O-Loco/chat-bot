import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

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
