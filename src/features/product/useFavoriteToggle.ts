import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { addFavorite, removeFavorite } from '../../api/favorites.ts';

type FavoriteItem = {
  slug: string;
  isFavorite?: boolean;
};

type UseFavoriteToggleResult = {
  toggleFavorite: (productSlug: string) => Promise<void>;
  pendingFavoriteSlugs: Set<string>;
  failedFavoriteSlugs: Set<string>;
};

export function useFavoriteToggle<T extends FavoriteItem>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>
): UseFavoriteToggleResult {
  const pendingFavoriteSlugsRef = useRef<Set<string>>(new Set());
  const errorTimeoutsRef = useRef<Map<string, number>>(new Map());
  const [pendingFavoriteSlugs, setPendingFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const [failedFavoriteSlugs, setFailedFavoriteSlugs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const activeErrorTimeouts = errorTimeoutsRef.current;

    return () => {
      activeErrorTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      activeErrorTimeouts.clear();
    };
  }, []);

  const toggleFavorite = useCallback(
    async (productSlug: string) => {
      if (pendingFavoriteSlugsRef.current.has(productSlug)) return;

      const product = items.find((item) => item.slug === productSlug);
      if (!product) return;

      const isFavorite = product.isFavorite ?? false;
      const nextIsFavorite = !isFavorite;

      pendingFavoriteSlugsRef.current.add(productSlug);
      setPendingFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(productSlug));
      setFailedFavoriteSlugs((currentSlugs) => {
        if (!currentSlugs.has(productSlug)) return currentSlugs;

        const nextSlugs = new Set(currentSlugs);
        nextSlugs.delete(productSlug);
        return nextSlugs;
      });
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.slug === productSlug
            ? { ...currentItem, isFavorite: nextIsFavorite }
            : currentItem
        )
      );

      const handleFavoriteFailure = (requestError: unknown) => {
        console.error(
          `Błąd ${isFavorite ? 'usuwania produktu z' : 'dodawania produktu do'} ulubionych (${productSlug}):`,
          requestError
        );
        setItems((currentItems) =>
          currentItems.map((currentItem) =>
            currentItem.slug === productSlug ? { ...currentItem, isFavorite } : currentItem
          )
        );
        setFailedFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(productSlug));

        const previousTimeout = errorTimeoutsRef.current.get(productSlug);
        if (previousTimeout) window.clearTimeout(previousTimeout);

        const timeout = window.setTimeout(() => {
          setFailedFavoriteSlugs((currentSlugs) => {
            const nextSlugs = new Set(currentSlugs);
            nextSlugs.delete(productSlug);
            return nextSlugs;
          });
          errorTimeoutsRef.current.delete(productSlug);
        }, 1200);

        errorTimeoutsRef.current.set(productSlug, timeout);
      };

      try {
        const { error } = isFavorite
          ? await removeFavorite(productSlug)
          : await addFavorite(productSlug);

        if (error) {
          handleFavoriteFailure(error);
          return;
        }
      } catch (requestError) {
        handleFavoriteFailure(requestError);
      } finally {
        pendingFavoriteSlugsRef.current.delete(productSlug);
        setPendingFavoriteSlugs((currentSlugs) => {
          const nextSlugs = new Set(currentSlugs);
          nextSlugs.delete(productSlug);
          return nextSlugs;
        });
      }
    },
    [items, setItems]
  );

  return {
    toggleFavorite,
    pendingFavoriteSlugs,
    failedFavoriteSlugs,
  };
}
