import ProductCard from './components/ProductCard.tsx';
import bikeImage from './assets/img.png';
import panoramicImage from './assets/panoramic.png';
import * as React from 'react';
import PanoramicImage from './components/PanoramicImage.tsx';

function App() {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const onFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <PanoramicImage image={panoramicImage} title="Deski SUP" />
      </div>
      <ProductCard
        name="Rower szosowy"
        price={89}
        image={bikeImage}
        alt="Zdjęcie rowera"
        onClick={() => alert('Dodano!')}
        isFavorite={isFavorite}
        onFavoriteToggle={onFavoriteToggle}
      />
    </div>
  );
}

export default App;
