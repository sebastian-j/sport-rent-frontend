import type { CartProduct } from './cartTypes.ts';
import type { RentalDate } from './rentalDate.ts';

type ReconciledCartDate = {
  products: CartProduct[];
  merged: boolean;
};

type UpdatedCartDate = {
  products: CartProduct[];
  date?: RentalDate;
  requiresSize: boolean;
};

export function reconcileCartDate(
  products: CartProduct[],
  sourceId: number,
  savedDate: RentalDate
): ReconciledCartDate {
  const product = products.find((item) => item.dates.some((date) => date.id === sourceId));
  if (!product) return { products, merged: false };

  const mergeTarget = product.dates.find(
    (date) => date.id === savedDate.id && date.id !== sourceId
  );
  if (!mergeTarget) {
    const sourceDate = product.dates.find((date) => date.id === sourceId);
    const persistedDate = {
      ...savedDate,
      uiKey: sourceDate?.uiKey ?? savedDate.uiKey,
    };

    return {
      products: products.map((item) =>
        item.slug === product.slug
          ? {
              ...item,
              dates: item.dates.map((date) => (date.id === sourceId ? persistedDate : date)),
            }
          : item
      ),
      merged: false,
    };
  }

  const mergedDate = {
    ...savedDate,
    uiKey: mergeTarget.uiKey,
  };
  let emittedMergeTarget = false;
  const dates = product.dates.flatMap((date) => {
    if (date.id === sourceId) return [];
    if (date.id !== savedDate.id) return [date];
    if (emittedMergeTarget) return [];

    emittedMergeTarget = true;
    return [mergedDate];
  });

  return {
    products: products.map((item) => (item.slug === product.slug ? { ...item, dates } : item)),
    merged: true,
  };
}

export function updateCartDate(
  products: CartProduct[],
  productSlug: string,
  dateId: number,
  changes: Partial<RentalDate>
): UpdatedCartDate {
  const product = products.find((item) => item.slug === productSlug);
  const currentDate = product?.dates.find((date) => date.id === dateId);
  if (!product || !currentDate) {
    return { products, requiresSize: false };
  }

  const date = { ...currentDate, ...changes };
  return {
    products: products.map((item) =>
      item.slug === productSlug
        ? {
            ...item,
            dates: item.dates.map((current) => (current.id === dateId ? date : current)),
          }
        : item
    ),
    date,
    requiresSize: product.sizes.length > 0,
  };
}

export function removeCartDate(
  products: CartProduct[],
  productSlug: string,
  dateId: number
): CartProduct[] {
  return products.flatMap((product) => {
    if (product.slug !== productSlug) return [product];

    const dates = product.dates.filter((date) => date.id !== dateId);
    return dates.length > 0 ? [{ ...product, dates }] : [];
  });
}

export function appendCartDate(
  products: CartProduct[],
  productSlug: string,
  date: RentalDate
): CartProduct[] {
  return products.map((product) =>
    product.slug === productSlug ? { ...product, dates: [...product.dates, date] } : product
  );
}

export function removeCartProduct(products: CartProduct[], productSlug: string): CartProduct[] {
  return products.filter((product) => product.slug !== productSlug);
}
