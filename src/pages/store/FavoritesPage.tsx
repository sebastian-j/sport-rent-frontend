import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../assets/products/products.ts';
import ProductCard from '../../features/product/ProductCard.tsx';

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

      {favorites.length === 0 ? (
        <div className="py-20 text-center text-app-textMuted">
          <p className="text-xl">Brak ulubionych produktów.</p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 p-4 mt-4 justify-evenly items-center w-full">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              alt={product.alt}
              isFavorite={true}
              onFavoriteToggle={() => handleRemoveFavorite(product.id)}
              onClick={() => navigate(`/product/${product.slug}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
