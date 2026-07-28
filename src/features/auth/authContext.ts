import { createContext, useContext } from 'react';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error';

export type AuthContextValue = {
  status: AuthStatus;
  establishSession: (accessToken: string) => void;
  logout: () => Promise<void>;
  retrySessionRestore: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
