import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ferratyImage from '../../assets/categories/ferraty.png';
import namiotyImage from '../../assets/categories/namioty.png';
import przyczepkiImage from '../../assets/categories/przyczepki.png';
import roweryImage from '../../assets/categories/rowery.png';
import panoramicImage from '../../assets/panoramic_small.png';
import { PRODUCTS } from '../../assets/products/products.ts';
import CategoryBar from '../../components/CategoryBar.tsx';
import CategoryCard from '../../components/CategoryCard.tsx';
import CategoryCardSlider from '../../components/CategoryCardSlider.tsx';
import PanoramicImage from '../../components/PanoramicImage.tsx';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';

const CATEGORY_CARDS = {
  trailers: {
    title: 'Przyczepki rowerowe THULA',
    description: 'U nas wypożyczysz najnowsze modele przyczepek rowerowych renomowanej marki THULE',
    categorySlug: 'przyczepki-rowerowe',
    image: przyczepkiImage,
    imagePosition: 'left',
    size: 'medium',
    className: 'bg-app-surface',
  },
  ferrata: {
    title: 'Wybierasz się na via ferraty',
    description: 'Nie musisz kupować wszystkiego - możesz wypożyczyć u nas!',
    categorySlug: 'via-ferraty-i-wspinanie',
    image: ferratyImage,
    imagePosition: 'left',
    size: 'small',
    className: 'bg-app-surfaceNeutral',
  },
  gravel: {
    title: 'Rowery TREK GRAVEL',
    description: 'Rowery typu gravel, sakwy rowerowe, namioty na rowerowe wyprawy.',
    categorySlug: 'rowery-i-akcesoria',
    image: roweryImage,
    imagePosition: 'left',
    size: 'small',
    invertedText: true,
    className: 'bg-app-surfaceStrongNeutral',
  },
  tents: {
    title: 'Namioty THULE',
    description:
      'Wypożycz namiot dachowy THULE. Zapewniamy pomoc w montażu. Skontaktuj się z nami, aby poznać szczegóły i dopasować namiot do Twojego samochodu.',
    categorySlug: 'namioty',
    image: namiotyImage,
    imagePosition: 'right',
    size: 'large',
    className: 'bg-app-surfaceNeutral',
  },
} as const;

export default function HomePage() {
  const navigate = useNavigate();
  const [favoritesSlugs, setFavoritesSlugs] = useState<Set<string>>(() => new Set());

  const toggleFavorite = (productSlug: string) => {
    setFavoritesSlugs((previous) => {
      const next = new Set(previous);

      if (next.has(productSlug)) {
        next.delete(productSlug);
      } else {
        next.add(productSlug);
      }

      return next;
    });
  };

  return (
    <div>
      <div className="w-full">
        <PanoramicImage image={panoramicImage} title="Deski SUP" />
      </div>

      <CategoryCardSlider>
        {Object.values(CATEGORY_CARDS).map((card) => (
          <CategoryCard key={card.categorySlug} {...card} />
        ))}
      </CategoryCardSlider>

      <div className="hidden lg:flex lg:flex-row">
        <div className="flex flex-col w-full">
          <CategoryCard {...CATEGORY_CARDS.trailers} />

          <div className="flex flex-col lg:flex-row">
            <CategoryCard {...CATEGORY_CARDS.ferrata} />
            <CategoryCard {...CATEGORY_CARDS.gravel} />
          </div>
        </div>
        <CategoryCard {...CATEGORY_CARDS.tents} />
      </div>

      <CategoryBar />
      <ProductCardGrid className="my-4">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.slug}
            name={product.name}
            price={product.price}
            image={product.images[0]}
            alt={product.alt}
            onClick={() => navigate(`/product/${product.slug}`)}
            isFavorite={favoritesSlugs.has(product.slug)}
            onFavoriteToggle={() => toggleFavorite(product.slug)}
          />
        ))}
      </ProductCardGrid>
    </div>
  );
}
