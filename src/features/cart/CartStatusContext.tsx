import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCartStatus } from '../../api/cart.ts';
import { useAuth } from '../auth/authContext.ts';
import { CartStatusContext } from './cartStatusContext.ts';

export function CartStatusProvider({ children }: PropsWithChildren) {
  const { status: authStatus } = useAuth();
  const [hasItems, setHasItems] = useState(false);
  const latestRequestId = useRef(0);

  const refreshCartStatus = useCallback(async () => {
    const requestId = ++latestRequestId.current;

    if (authStatus !== 'authenticated') {
      setHasItems(false);
      return;
    }

    try {
      const result = await getCartStatus();
      if (requestId !== latestRequestId.current) return;

      setHasItems(!result.error && Boolean(result.data?.has_items));
    } catch {
      if (requestId === latestRequestId.current) setHasItems(false);
    }
  }, [authStatus]);

  useEffect(() => {
    void refreshCartStatus();
  }, [refreshCartStatus]);

  const value = useMemo(() => ({ hasItems, refreshCartStatus }), [hasItems, refreshCartStatus]);

  return <CartStatusContext.Provider value={value}>{children}</CartStatusContext.Provider>;
}
