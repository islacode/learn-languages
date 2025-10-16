import { createContext, useContext, ReactNode } from 'react';
import { UserAuthData } from '@/types';
import { useAuth } from '@/hooks';

const AuthContext = createContext<UserAuthData | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
