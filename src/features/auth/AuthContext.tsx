import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { logout as logoutRequest } from '../../api/auth.ts';
import {
  refreshAccessToken,
  setAccessToken,
  subscribeToAccessToken,
} from '../../api/authSession.ts';
import { AuthContext, type AuthStatus } from './authContext.ts';

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  useEffect(() => {
    return subscribeToAccessToken((token) => {
      setStatus(token ? 'authenticated' : 'anonymous');
    });
  }, []);

  useEffect(() => {
    let isCurrentAttempt = true;

    setStatus('loading');

    refreshAccessToken()
      .then((token) => {
        if (isCurrentAttempt) setStatus(token ? 'authenticated' : 'anonymous');
      })
      .catch(() => {
        if (isCurrentAttempt) setStatus('error');
      });

    return () => {
      isCurrentAttempt = false;
    };
  }, [restoreAttempt]);

  const establishSession = useCallback((token: string) => {
    setAccessToken(token);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
    }
  }, []);

  const retrySessionRestore = useCallback(() => {
    setRestoreAttempt((attempt) => attempt + 1);
  }, []);

  const value = useMemo(
    () => ({ status, establishSession, logout, retrySessionRestore }),
    [establishSession, logout, retrySessionRestore, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
