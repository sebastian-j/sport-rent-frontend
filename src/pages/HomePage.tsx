import PanoramicImage from '../components/PanoramicImage';
import ProductCard from '../components/ProductCard';
import CategoryBar from '../components/CategoryBar';
import bikeImage from '../assets/bike.png';
import panoramicImage from '../assets/panoramic_small.png';
import { useState } from 'react';

export default function HomePage() {
  const [isFavorite, setIsFavorite] = useState(false);

  const onFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div className="w-full">
        <PanoramicImage image={panoramicImage} title="Deski SUP" />
      </div>
      <CategoryBar />
      <ProductCard
        name="Rower szosowy"
        price={89}
        image={bikeImage}
        alt="Zdjęcie rowera"
        onClick={() => alert('Dodano!')}
        isFavorite={isFavorite}
        onFavoriteToggle={onFavoriteToggle}
      />
    </>
  );
}
