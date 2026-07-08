import PanoramicImage from '../components/PanoramicImage';
import ProductCard from '../components/ProductCard';
import panoramicImage from '../assets/panoramic_small.png';
import { useState } from 'react';
import { PRODUCTS } from '../assets/products/products.ts';

export default function HomePage() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set());

  const toggleFavorite = (productId: number) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  return (
    <>
      <div className="w-full">
        <PanoramicImage image={panoramicImage} title="Deski SUP" />
      </div>
      <div className="flex flex-row gap-4 flex-wrap items-center justify-evenly my-4 w-full">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            alt={product.alt}
            onClick={() => alert('Dodano ' + product.name)}
            isFavorite={favoriteIds.has(product.id)}
            onFavoriteToggle={() => toggleFavorite(product.id)}
          />
        ))}
      </div>
    </>
  );
}
