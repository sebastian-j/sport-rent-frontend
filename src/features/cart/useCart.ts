import { useState } from 'react';

import type { CartProduct, DateField } from './cartTypes.ts';

export function useCart(initialProducts: CartProduct[]) {
  const [products, setProducts] = useState(initialProducts);

  const updateRentalDate = (
    productId: number,
    dateId: number,
    field: DateField,
    value: Date | null
  ) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              dates: product.dates.map((date) =>
                date.id === dateId ? { ...date, [field]: value } : date
              ),
            }
          : product
      )
    );
  };

  const updateQuantity = (productId: number, dateId: number, quantity: number) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              dates: product.dates.map((date) =>
                date.id === dateId ? { ...date, quantity } : date
              ),
            }
          : product
      )
    );
  };

  const updateSize = (productId: number, dateId: number, size: string) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              dates: product.dates.map((date) => (date.id === dateId ? { ...date, size } : date)),
            }
          : product
      )
    );
  };

  const removeRentalDate = (productId: number, dateId: number) => {
    setProducts((previous) =>
      previous.flatMap((product) => {
        if (product.id !== productId) return [product];

        const dates = product.dates.filter((date) => date.id !== dateId);
        return dates.length > 0 ? [{ ...product, dates }] : [];
      })
    );
  };

  const addRentalDate = (productId: number) => {
    setProducts((previous) =>
      previous.map((product) => {
        if (product.id !== productId) return product;

        const nextDateId = Math.max(0, ...product.dates.map((date) => date.id)) + 1;

        return {
          ...product,
          dates: [
            ...product.dates,
            {
              id: nextDateId,
              quantity: 1,
              size: null,
              start_date: null,
              end_date: null,
            },
          ],
        };
      })
    );
  };

  const removeProduct = (productId: number) => {
    setProducts((previous) => previous.filter((product) => product.id !== productId));
  };

  return {
    products,
    updateRentalDate,
    updateQuantity,
    updateSize,
    removeRentalDate,
    addRentalDate,
    removeProduct,
  };
}
