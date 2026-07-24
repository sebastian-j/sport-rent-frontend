import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { type FavoritesResponse, getFavorites, removeFavorite } from '../../api/favorites.ts';
import { PRODUCTS } from '../../assets/products/products.ts';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoritesResponse[]>([]);
  const [pendingFavoriteSlugs, setPendingFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const [failedFavoriteSlugs, setFailedFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const errorTimeouts = useRef<Map<string, number>>(new Map());

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
      const { data, error } = await getFavorites();

      if (error || !data) {
        console.error('Błąd pobierania ulubionych produktów:', error);
        return;
      }

      // TODO: Change if photos come from backend
      setFavorites(
        data.map((item) => {
          const matchedProduct = PRODUCTS.find((product) => product.slug === item.slug);

          return {
            ...item,
            image: matchedProduct?.images[0] ?? item.image,
          };
        })
      );
      // setFavorites(data)
    }
    void loadFavorites();

    return () => {
      activeErrorTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      activeErrorTimeouts.clear();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 pt-8 pb-4">
        <h1 className="mb-4 text-center text-4xl font-bold text-app-textStrong">Ulubione</h1>
      </div>

      <ProductCardGrid className="mt-4">
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
                exit={{ scale: [1, 1.08, 0.75], opacity: [1, 1, 0] }}
                transition={{ duration: 0.28, times: [0, 0.4, 1], ease: 'easeOut' }}
              >
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  alt={product.alt}
                  isFavorite={true}
                  isFavoriteUpdating={pendingFavoriteSlugs.has(product.slug)}
                  hasFavoriteError={failedFavoriteSlugs.has(product.slug)}
                  onFavoriteToggle={() => handleRemoveFavorite(product.slug)}
                  onClick={() => navigate(`/product/${product.slug}`)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </ProductCardGrid>
    </div>
  );
}
