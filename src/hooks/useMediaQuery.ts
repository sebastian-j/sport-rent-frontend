import { useCallback, useSyncExternalStore } from 'react';

type MediaQueryStore = {
  getSnapshot: () => boolean;
  subscribe: (callback: () => void) => () => void;
};

const mediaQueryStores = new Map<string, MediaQueryStore>();

function getMediaQueryStore(query: string) {
  const existingStore = mediaQueryStores.get(query);
  if (existingStore) return existingStore;

  const mediaQueryList = window.matchMedia(query);
  const subscribers = new Set<() => void>();
  const notifySubscribers = () => subscribers.forEach((callback) => callback());

  const store: MediaQueryStore = {
    getSnapshot: () => mediaQueryList.matches,
    subscribe: (callback) => {
      if (subscribers.size === 0) {
        mediaQueryList.addEventListener('change', notifySubscribers);
      }

      subscribers.add(callback);

      return () => {
        subscribers.delete(callback);

        if (subscribers.size === 0) {
          mediaQueryList.removeEventListener('change', notifySubscribers);
        }
      };
    },
  };

  mediaQueryStores.set(query, store);
  return store;
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') return () => undefined;
      return getMediaQueryStore(query).subscribe(callback);
    },
    [query]
  );
  const getSnapshot = useCallback(
    () => (typeof window === 'undefined' ? false : getMediaQueryStore(query).getSnapshot()),
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
