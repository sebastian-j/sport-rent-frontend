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
import {
  appendCartDate,
  reconcileCartDate,
  removeCartDate,
  removeCartProduct,
  updateCartDate,
} from './cartState.ts';
import { useCartStatus } from './cartStatusContext.ts';
import type { CartProduct, DateField } from './cartTypes.ts';
import { isPersistedRentalDate, isRentalDateValid, type RentalDate } from './rentalDate.ts';

type CartLoadStatus = 'loading' | 'ready' | 'error';

export function useCart() {
  const { refreshCartStatus } = useCartStatus();
  const [products, setProductsState] = useState<CartProduct[]>([]);
  const [status, setStatus] = useState<CartLoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [mergeTargetId, setMergeTargetId] = useState<number | null>(null);
  const productsRef = useRef<CartProduct[]>([]);
  const nextDraftId = useRef(-1);
  const itemQueues = useRef(new Map<number, Promise<void>>());
  const itemIdAliases = useRef(new Map<number, number>());
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
      const result = reconcileCartDate(productsRef.current, sourceId, savedDate);
      setProducts(result.products);
      if (result.merged) showMergeAnimation(savedDate.id);
    },
    [setProducts, showMergeAnimation]
  );

  const resolveItemId = useCallback((itemId: number) => {
    const visitedIds: number[] = [];
    let resolvedId = itemId;
    let nextId = itemIdAliases.current.get(resolvedId);

    while (nextId !== undefined && !visitedIds.includes(resolvedId)) {
      visitedIds.push(resolvedId);
      resolvedId = nextId;
      nextId = itemIdAliases.current.get(resolvedId);
    }

    visitedIds.forEach((visitedId) => itemIdAliases.current.set(visitedId, resolvedId));
    return resolvedId;
  }, []);

  const queuePatch = useCallback(
    (itemId: number, body: UpdateCartItemRequest) => {
      const resolvedItemId = resolveItemId(itemId);
      const queueKey =
        (itemQueues.current.has(resolvedItemId)
          ? resolvedItemId
          : [...itemQueues.current.keys()].find(
              (queuedItemId) => resolveItemId(queuedItemId) === resolvedItemId
            )) ?? itemId;
      const previous = itemQueues.current.get(queueKey) ?? Promise.resolve();
      const queued = previous
        .catch(() => undefined)
        .then(() =>
          withPending(async () => {
            const requestItemId = resolveItemId(itemId);
            const result = await updateCartItem(requestItemId, body);
            if (result.error || !result.data) {
              throw new Error('Updating a cart item failed');
            }

            const savedDate = mapCartDate(result.data);
            if (result.data.id !== requestItemId) {
              itemIdAliases.current.set(requestItemId, result.data.id);
              itemIdAliases.current.set(itemId, result.data.id);
              const currentQueue = itemQueues.current.get(queueKey);
              if (currentQueue) itemQueues.current.set(result.data.id, currentQueue);
              reconcileSavedDate(requestItemId, savedDate);
            } else if (
              ![...itemQueues.current].some(
                ([queuedItemId, queuedRequest]) =>
                  resolveItemId(queuedItemId) === result.data.id && queuedRequest !== queued
              )
            ) {
              reconcileSavedDate(requestItemId, savedDate);
            }
          })
        )
        .catch(recoverFromSaveError)
        .finally(() => {
          for (const [queuedItemId, queuedRequest] of itemQueues.current) {
            if (queuedRequest === queued) itemQueues.current.delete(queuedItemId);
          }
        });
      itemQueues.current.set(queueKey, queued);
    },
    [reconcileSavedDate, recoverFromSaveError, resolveItemId, withPending]
  );

  const createDraftIfComplete = useCallback(
    (productSlug: string, date: RentalDate) => {
      const product = productsRef.current.find((item) => item.slug === productSlug);
      if (
        !product ||
        isPersistedRentalDate(date) ||
        creatingDrafts.current.has(date.id) ||
        !isRentalDateValid(date, product.sizes.length > 0)
      ) {
        return;
      }

      creatingDrafts.current.add(date.id);
      void withPending(async () => {
        try {
          const result = await addCartItem({
            product_slug: productSlug,
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
    (productSlug: string, dateId: number, changes: Partial<RentalDate>) => {
      const result = updateCartDate(productsRef.current, productSlug, dateId, changes);
      setProducts(result.products);
      if (!result.date) return;

      if (isPersistedRentalDate(result.date)) {
        if (!isRentalDateValid(result.date, result.requiresSize)) return;

        queuePatch(dateId, {
          quantity: result.date.quantity,
          size: result.date.size,
          start_date: formatLocalDate(result.date.start_date),
          end_date: formatLocalDate(result.date.end_date),
        });
      } else {
        createDraftIfComplete(productSlug, result.date);
      }
    },
    [createDraftIfComplete, queuePatch, setProducts]
  );

  const updateRentalDate = (
    productSlug: string,
    dateId: number,
    field: DateField,
    value: Date | null
  ) => changeDate(productSlug, dateId, { [field]: value });

  const updateRentalDateRange = (
    productSlug: string,
    dateId: number,
    startDate: Date,
    endDate: Date | null
  ) =>
    changeDate(productSlug, dateId, {
      start_date: startDate,
      end_date: endDate,
    });

  const updateQuantity = (productSlug: string, dateId: number, quantity: number) =>
    changeDate(productSlug, dateId, { quantity });

  const updateSize = (productSlug: string, dateId: number, size: string) =>
    changeDate(productSlug, dateId, { size });

  const removeRentalDate = useCallback(
    (productSlug: string, dateId: number) => {
      const date = productsRef.current
        .find((product) => product.slug === productSlug)
        ?.dates.find((item) => item.id === dateId);
      if (!date || creatingDrafts.current.has(dateId)) return;

      const removeLocally = () =>
        setProducts((previous) => removeCartDate(previous, productSlug, dateId));

      if (!isPersistedRentalDate(date)) {
        removeLocally();
        return;
      }
      void withPending(async () => {
        try {
          const result = await deleteCartItem(dateId);
          if (result.error) throw new Error('Deleting a cart item failed');
          removeLocally();
          void refreshCartStatus();
        } catch {
          await recoverFromSaveError();
        }
      });
    },
    [recoverFromSaveError, refreshCartStatus, setProducts, withPending]
  );

  const addRentalDate = useCallback(
    (productSlug: string) => {
      const id = nextDraftId.current--;
      setProducts((previous) =>
        appendCartDate(previous, productSlug, {
          id,
          uiKey: `draft-${Math.abs(id)}`,
          quantity: 1,
          size: null,
          start_date: null,
          end_date: null,
        })
      );
    },
    [setProducts]
  );

  const removeProduct = useCallback(
    (productSlug: string) => {
      void withPending(async () => {
        try {
          const result = await deleteCartProduct(productSlug);
          if (result.error) throw new Error('Deleting a cart product failed');
          setProducts((previous) => removeCartProduct(previous, productSlug));
          void refreshCartStatus();
        } catch {
          await recoverFromSaveError();
        }
      });
    },
    [recoverFromSaveError, refreshCartStatus, setProducts, withPending]
  );

  return {
    products,
    status,
    error,
    isPending: pendingOperations > 0,
    mergeTargetId,
    retry: loadCart,
    updateRentalDate,
    updateRentalDateRange,
    updateQuantity,
    updateSize,
    removeRentalDate,
    addRentalDate,
    removeProduct,
  };
}
