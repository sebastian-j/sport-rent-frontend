import PanoramicImage from '../../components/PanoramicImage.tsx';
import ProductCard from '../../features/product/ProductCard.tsx';
import CategoryBar from '../../components/CategoryBar.tsx';
import panoramicImage from '../../assets/panoramic_small.png';
import { useState } from 'react';
import { PRODUCTS } from '../../assets/products/products.ts';
import CategoryCard from '../../components/CategoryCard.tsx';
import ferratyImage from '../../assets/categories/ferraty.png';
import namiotyImage from '../../assets/categories/namioty.png';
import przyczepkiImage from '../../assets/categories/przyczepki.png';
import roweryImage from '../../assets/categories/rowery.png';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
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
    <div>
      <div className="w-full">
        <PanoramicImage image={panoramicImage} title="Deski SUP" />
      </div>

      <div className="flex flex-row">
        <div className="flex flex-col w-full">
          <CategoryCard
            title={'Przyczepki rowerowe THULA'}
            description="U nas wypożyczysz najnowsze modele przyczepek rowerowych renomowanej marki THULE"
            image={przyczepkiImage}
            imagePosition="left"
            size="medium"
            className="bg-app-surface"
          />

          <div className="flex flex-row">
            <CategoryCard
              title="Wybierasz się na via ferraty"
              description="Nie musisz kupować wszystkiego - możesz wypożyczyć u nas!"
              image={ferratyImage}
              imagePosition="left"
              size="small"
              className="bg-app-surfaceNeutral"
            />
            <CategoryCard
              title="Rowery TREK GRAVEL"
              description="Rowery typu gravel, sakwy rowerowe, namioty na rowerowe wyprawy."
              image={roweryImage}
              imagePosition="left"
              size="small"
              invertedText
              className="bg-app-surfaceStrongNeutral"
            />
          </div>
        </div>
        <CategoryCard
          title="Namioty THULE"
          description="Wypożysz namiot dachowy THULE. Zapewniamy pomoc w montażu. Skontaktuj się z nami, aby poznać szczególły i dopasować  namiot do Twojego samochodu."
          image={namiotyImage}
          imagePosition="right"
          size="large"
          onClick={() => {}}
          className="bg-app-surfaceNeutral"
        />
      </div>

      <CategoryBar />
      <div className="flex flex-row gap-4 flex-wrap items-center justify-evenly my-4 w-full">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.images[0]}
            alt={product.alt}
            onClick={() => navigate(`/product/${product.slug}`)}
            isFavorite={favoriteIds.has(product.id)}
            onFavoriteToggle={() => toggleFavorite(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
