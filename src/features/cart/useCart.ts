import { useCallback, useEffect, useRef, useState } from 'react';

import {
  addCartItem,
  deleteCartItem,
  deleteCartProduct,
  getCart,
  updateCartItem,
  type UpdateCartItemRequest,
} from '../../api/cart.ts';
import { formatLocalDate } from '../../utils/localDate.ts';
import { mapCartDate, mapCartProduct } from './cartMappers.ts';
import type { CartProduct, DateField } from './cartTypes.ts';
import { isPersistedRentalDate, isRentalDateValid, type RentalDate } from './rentalDate.ts';

type CartLoadStatus = 'loading' | 'ready' | 'error';

export function useCart() {
  const [products, setProductsState] = useState<CartProduct[]>([]);
  const [status, setStatus] = useState<CartLoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [mergeTargetId, setMergeTargetId] = useState<number | null>(null);
  const productsRef = useRef<CartProduct[]>([]);
  const nextDraftId = useRef(-1);
  const itemQueues = useRef(new Map<number, Promise<void>>());
  const creatingDrafts = useRef(new Set<number>());
  const mergeAnimationTimer = useRef<number | null>(null);

  const setProducts = useCallback(
    (updater: CartProduct[] | ((previous: CartProduct[]) => CartProduct[])) => {
      const next = typeof updater === 'function' ? updater(productsRef.current) : updater;
      productsRef.current = next;
      setProductsState(next);
      return next;
    },
    []
  );

  const loadCart = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await getCart();
      if (result.error || !result.data) {
        throw new Error('Nie udało się pobrać koszyka.');
      }
      setProducts(result.data.map(mapCartProduct));
      setStatus('ready');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Nie udało się pobrać koszyka.');
      setStatus('error');
    }
  }, [setProducts]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  useEffect(
    () => () => {
      if (mergeAnimationTimer.current !== null) {
        window.clearTimeout(mergeAnimationTimer.current);
      }
    },
    []
  );

  const withPending = useCallback(async (operation: () => Promise<void>) => {
    setPendingOperations((count) => count + 1);
    try {
      await operation();
    } finally {
      setPendingOperations((count) => count - 1);
    }
  }, []);

  const recoverFromSaveError = useCallback(async () => {
    setError('Nie udało się zapisać zmiany. Koszyk został ponownie pobrany.');
    try {
      const result = await getCart();
      if (result.error || !result.data) {
        throw new Error('Nie udało się pobrać koszyka.');
      }
      setProducts(result.data.map(mapCartProduct));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [setProducts]);

  const showMergeAnimation = useCallback((targetId: number) => {
    if (mergeAnimationTimer.current !== null) {
      window.clearTimeout(mergeAnimationTimer.current);
    }
    setMergeTargetId(targetId);
    mergeAnimationTimer.current = window.setTimeout(() => {
      setMergeTargetId(null);
      mergeAnimationTimer.current = null;
    }, 1400);
  }, []);

  const reconcileSavedDate = useCallback(
    (sourceId: number, savedDate: RentalDate) => {
      let mergedWithExistingDate = false;

      setProducts((previous) =>
        previous.map((product) => {
          if (!product.dates.some((date) => date.id === sourceId)) return product;

          const hasMergeTarget = product.dates.some(
            (date) => date.id === savedDate.id && date.id !== sourceId
          );
          if (!hasMergeTarget) {
            const sourceDate = product.dates.find((date) => date.id === sourceId);
            const persistedDate = {
              ...savedDate,
              uiKey: sourceDate?.uiKey ?? savedDate.uiKey,
            };
            return {
              ...product,
              dates: product.dates.map((date) => (date.id === sourceId ? persistedDate : date)),
            };
          }

          mergedWithExistingDate = true;
          const mergeTarget = product.dates.find(
            (date) => date.id === savedDate.id && date.id !== sourceId
          );
          const mergedDate = {
            ...savedDate,
            uiKey: mergeTarget?.uiKey ?? savedDate.uiKey,
          };
          let emittedMergeTarget = false;
          return {
            ...product,
            dates: product.dates.flatMap((date) => {
              if (date.id === sourceId) return [];
              if (date.id !== savedDate.id) return [date];
              if (emittedMergeTarget) return [];

              emittedMergeTarget = true;
              return [mergedDate];
            }),
          };
        })
      );

      if (mergedWithExistingDate) showMergeAnimation(savedDate.id);
    },
    [setProducts, showMergeAnimation]
  );

  const queuePatch = useCallback(
    (itemId: number, body: UpdateCartItemRequest) => {
      const previous = itemQueues.current.get(itemId) ?? Promise.resolve();
      const queued = previous
        .catch(() => undefined)
        .then(() =>
          withPending(async () => {
            const result = await updateCartItem(itemId, body);
            if (result.error || !result.data) {
              throw new Error('Updating a cart item failed');
            }
            if (result.data.id !== itemId) {
              reconcileSavedDate(itemId, mapCartDate(result.data));
            }
          })
        )
        .catch(recoverFromSaveError)
        .finally(() => {
          if (itemQueues.current.get(itemId) === queued) {
            itemQueues.current.delete(itemId);
          }
        });
      itemQueues.current.set(itemId, queued);
    },
    [reconcileSavedDate, recoverFromSaveError, withPending]
  );

  const createDraftIfComplete = useCallback(
    (productId: number, date: RentalDate) => {
      const product = productsRef.current.find((item) => item.id === productId);
      if (
        !product ||
        isPersistedRentalDate(date) ||
        creatingDrafts.current.has(date.id) ||
        !isRentalDateValid(date, Boolean(product.sizes?.length))
      ) {
        return;
      }

      creatingDrafts.current.add(date.id);
      void withPending(async () => {
        try {
          const result = await addCartItem({
            product_id: productId,
            quantity: date.quantity,
            size: date.size,
            start_date: formatLocalDate(date.start_date),
            end_date: formatLocalDate(date.end_date),
          });
          if (result.error || !result.data) throw new Error('Creating a cart item failed');

          reconcileSavedDate(date.id, mapCartDate(result.data));
        } catch {
          await recoverFromSaveError();
        } finally {
          creatingDrafts.current.delete(date.id);
        }
      });
    },
    [reconcileSavedDate, recoverFromSaveError, withPending]
  );

  const changeDate = useCallback(
    (productId: number, dateId: number, changes: Partial<RentalDate>) => {
      let changedDate: RentalDate | undefined;
      let requiresSize = false;
      setProducts((previous) =>
        previous.map((product) =>
          product.id === productId
            ? {
                ...product,
                dates: product.dates.map((date) => {
                  if (date.id !== dateId) return date;
                  requiresSize = Boolean(product.sizes?.length);
                  changedDate = { ...date, ...changes };
                  return changedDate;
                }),
              }
            : product
        )
      );
      if (!changedDate) return;

      if (isPersistedRentalDate(changedDate)) {
        if (!isRentalDateValid(changedDate, requiresSize)) return;

        queuePatch(dateId, {
          quantity: changedDate.quantity,
          size: changedDate.size,
          start_date: formatLocalDate(changedDate.start_date),
          end_date: formatLocalDate(changedDate.end_date),
        });
      } else {
        createDraftIfComplete(productId, changedDate);
      }
    },
    [createDraftIfComplete, queuePatch, setProducts]
  );

  const updateRentalDate = (
    productId: number,
    dateId: number,
    field: DateField,
    value: Date | null
  ) => changeDate(productId, dateId, { [field]: value });

  const updateQuantity = (productId: number, dateId: number, quantity: number) =>
    changeDate(productId, dateId, { quantity });

  const updateSize = (productId: number, dateId: number, size: string) =>
    changeDate(productId, dateId, { size });

  const removeRentalDate = useCallback(
    (productId: number, dateId: number) => {
      const date = productsRef.current
        .find((product) => product.id === productId)
        ?.dates.find((item) => item.id === dateId);
      if (!date || creatingDrafts.current.has(dateId)) return;

      const removeLocally = () =>
        setProducts((previous) =>
          previous.flatMap((product) => {
            if (product.id !== productId) return [product];
            const dates = product.dates.filter((item) => item.id !== dateId);
            return dates.length ? [{ ...product, dates }] : [];
          })
        );

      if (!isPersistedRentalDate(date)) {
        removeLocally();
        return;
      }
      void withPending(async () => {
        try {
          const result = await deleteCartItem(dateId);
          if (result.error) throw new Error('Deleting a cart item failed');
          removeLocally();
        } catch {
          await recoverFromSaveError();
        }
      });
    },
    [recoverFromSaveError, setProducts, withPending]
  );

  const addRentalDate = useCallback(
    (productId: number) => {
      const id = nextDraftId.current--;
      setProducts((previous) =>
        previous.map((product) =>
          product.id === productId
            ? {
                ...product,
                dates: [
                  ...product.dates,
                  {
                    id,
                    uiKey: `draft-${Math.abs(id)}`,
                    quantity: 1,
                    size: null,
                    start_date: null,
                    end_date: null,
                  },
                ],
              }
            : product
        )
      );
    },
    [setProducts]
  );

  const removeProduct = useCallback(
    (productId: number) => {
      void withPending(async () => {
        try {
          const result = await deleteCartProduct(productId);
          if (result.error) throw new Error('Deleting a cart product failed');
          setProducts((previous) => previous.filter((product) => product.id !== productId));
        } catch {
          await recoverFromSaveError();
        }
      });
    },
    [recoverFromSaveError, setProducts, withPending]
  );

  return {
    products,
    status,
    error,
    isPending: pendingOperations > 0,
    mergeTargetId,
    retry: loadCart,
    updateRentalDate,
    updateQuantity,
    updateSize,
    removeRentalDate,
    addRentalDate,
    removeProduct,
  };
}
