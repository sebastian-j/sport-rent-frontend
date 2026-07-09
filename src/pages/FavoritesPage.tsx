import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import bikeImage from '../assets/bike.png';

const INITIAL_FAVORITES = [
  { id: 1, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 2, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 3, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 4, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 5, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 6, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 7, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 8, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 9, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 10, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 11, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 12, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 13, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 14, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 15, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 16, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 17, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 18, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 19, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 20, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 21, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 22, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 23, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 24, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 25, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 26, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
  { id: 27, name: 'Rower Gravel', price: 89, image: bikeImage, alt: 'Rower Gravel' },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 pt-8 pb-4">
        <h1 className="text-4xl font-bold mb-4 text-neutral-900 text-center">Ulubione</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          <p className="text-xl">Brak ulubionych produktów.</p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 p-4 mt-4 justify-evenly items-center w-full">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              alt={product.alt}
              isFavorite={true}
              onFavoriteToggle={() => handleRemoveFavorite(product.id)}
              onClick={() => alert(`Dodano ${product.name} do koszyka!`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
