import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { type FavoritesResponse, getFavorites, removeFavorite } from '../../api/favorites.ts';
import PageHeader from '../../components/core/PageHeader.tsx';
import { useAuth } from '../../features/auth/authContext.ts';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';
import { RENT_ROUTES } from '../../routes.ts';
import { resolveImageUrl } from '../../utils/resolveImageUrl.ts';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { status: authStatus } = useAuth();
  const [favorites, setFavorites] = useState<FavoritesResponse[]>([]);
  const [pendingFavoriteSlugs, setPendingFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const [failedFavoriteSlugs, setFailedFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const errorTimeouts = useRef<Map<string, number>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const handleRemoveFavorite = async (slug: string) => {
    if (pendingFavoriteSlugs.has(slug)) return;

    setPendingFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(slug));
    setFailedFavoriteSlugs((currentSlugs) => {
      const nextSlugs = new Set(currentSlugs);
      nextSlugs.delete(slug);
      return nextSlugs;
    });

    try {
      const { error } = await removeFavorite(slug);

      if (error) throw error;

      setFavorites((currentFavorites) => currentFavorites.filter((item) => item.slug !== slug));
    } catch (error) {
      console.error(`Błąd usuwania produktu ${slug} z ulubionych:`, error);
      setFailedFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(slug));

      const previousTimeout = errorTimeouts.current.get(slug);
      if (previousTimeout) window.clearTimeout(previousTimeout);

      const timeout = window.setTimeout(() => {
        setFailedFavoriteSlugs((currentSlugs) => {
          const nextSlugs = new Set(currentSlugs);
          nextSlugs.delete(slug);
          return nextSlugs;
        });
        errorTimeouts.current.delete(slug);
      }, 1200);

      errorTimeouts.current.set(slug, timeout);
    } finally {
      setPendingFavoriteSlugs((currentSlugs) => {
        const nextSlugs = new Set(currentSlugs);
        nextSlugs.delete(slug);
        return nextSlugs;
      });
    }
  };

  useEffect(() => {
    const activeErrorTimeouts = errorTimeouts.current;

    async function loadFavorites() {
      setError(null);
      try {
        if (authStatus === 'authenticated') {
          const { data: favoritesData, error: favoritesError } = await getFavorites();

          if (favoritesError || !favoritesData) {
            console.error('Błąd pobierania ulubionych produktów:', favoritesError);
            setError('Nie udało się załadować ulubionych produktów. Spróbuj ponownie później.');
            return;
          }

          setFavorites(
            favoritesData.map((item) => ({
              ...item,
              image: resolveImageUrl(item.image),
            }))
          );
        } else if (authStatus === 'anonymous' || authStatus === 'error') {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Błąd podczas ładowania ulubionych produktów:', err);
        setError('Wystąpił błąd serwera. Spróbuj odświeżyć stronę.');
      }
    }

    if (authStatus !== 'loading') {
      void loadFavorites();
    }

    return () => {
      activeErrorTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      activeErrorTimeouts.clear();
    };
  }, [authStatus, fetchTrigger]);

  return (
    <div className="w-full">
      <PageHeader className="mx-auto max-w-[1400px]">Ulubione</PageHeader>

      {error && (
        <div className="flex w-full flex-col items-center justify-center p-8 text-center text-red-500">
          <p className="mb-4 text-lg">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setFetchTrigger((prev) => prev + 1);
            }}
            className="rounded-full bg-red-100 px-6 py-2 font-medium text-red-600 transition-colors hover:bg-red-200"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!error && (
        <ProductCardGrid className="mb-4" itemCount={favorites.length}>
          <AnimatePresence initial={false} mode="popLayout">
            {favorites.length === 0 ? (
              <motion.div
                key="empty-favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full w-full py-20 text-center text-app-textMuted"
              >
                <p className="text-xl">Brak ulubionych produktów.</p>
              </motion.div>
            ) : (
              favorites.map((product) => (
                <motion.div
                  key={product.slug}
                  layout
                  style={{ width: '100%' }}
                  exit={{ scale: [1, 1.08, 0.75], opacity: [1, 1, 0] }}
                  transition={{
                    layout: { duration: 0.35, ease: 'easeInOut' },
                    duration: 0.28,
                    times: [0, 0.4, 1],
                    ease: 'easeOut',
                  }}
                >
                  <ProductCard
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    alt={product.alt}
                    isFavorite={true}
                    isFavoriteUpdating={pendingFavoriteSlugs.has(product.slug)}
                    hasFavoriteError={failedFavoriteSlugs.has(product.slug)}
                    favoriteErrorTarget="card"
                    showFavoriteUpdatingOverlay={true}
                    onFavoriteToggle={() => handleRemoveFavorite(product.slug)}
                    onClick={() => navigate(RENT_ROUTES.product(product.slug))}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ProductCardGrid>
      )}
    </div>
  );
}
