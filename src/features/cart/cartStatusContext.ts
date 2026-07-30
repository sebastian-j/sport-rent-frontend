import { createContext, useContext } from 'react';

export type CartStatusContextValue = {
  hasItems: boolean;
  refreshCartStatus: () => Promise<void>;
};

export const CartStatusContext = createContext<CartStatusContextValue | null>(null);

export const useCartStatus = () => {
  const context = useContext(CartStatusContext);

  if (!context) {
    throw new Error('useCartStatus must be used inside CartStatusProvider');
  }

  return context;
};
