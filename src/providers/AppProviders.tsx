import { type PropsWithChildren } from 'react';

import { ThemeProvider } from '../components/core/ThemeSelector.tsx';
import { AuthProvider } from '../features/auth/AuthContext.tsx';
import { CartStatusProvider } from '../features/cart/CartStatusContext.tsx';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartStatusProvider>{children}</CartStatusProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
