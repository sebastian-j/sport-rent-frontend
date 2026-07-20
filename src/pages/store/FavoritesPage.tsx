import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../assets/products/products.ts';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';

const INITIAL_FAVORITES = PRODUCTS.slice(0, 12);

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

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
                key={product.id}
                layout
                exit={{ scale: [1, 1.08, 0.75], opacity: [1, 1, 0] }}
                transition={{ duration: 0.28, times: [0, 0.4, 1], ease: 'easeOut' }}
              >
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  alt={product.alt}
                  isFavorite={true}
                  onFavoriteToggle={() => handleRemoveFavorite(product.id)}
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
