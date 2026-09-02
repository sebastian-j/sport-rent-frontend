import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomCategory } from '../../api/category.ts';
import { getProducts } from '../../api/product.ts';
import ferratyImage from '../../assets/categories/ferraty.webp';
import namiotyImage from '../../assets/categories/namioty.webp';
import przyczepkiImage from '../../assets/categories/przyczepki.webp';
import roweryImage from '../../assets/categories/rowery.webp';
import CategoryBar from '../../components/CategoryBar.tsx';
import CategoryCard from '../../components/CategoryCard.tsx';
import CategoryCardSlider from '../../components/CategoryCardSlider.tsx';
import ActivityIndicator from '../../components/core/ActivityIndicator.tsx';
import PanoramicCarousel from '../../components/PanoramicCarousel.tsx';
import { PanoramicImagePlaceholder } from '../../components/PanoramicImage.tsx';
import { useAuth } from '../../features/auth/authContext.ts';
import useCategories from '../../features/category/useCategories.ts';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';
import type { ProductProps } from '../../features/product/productProps.ts';
import { useFavoriteToggle } from '../../features/product/useFavoriteToggle.ts';
import { getCategorySearchPath } from '../../features/search/categoryUtils.ts';
import { RENT_ROUTES } from '../../routes.ts';
import { resolveImageUrls } from '../../utils/resolveImageUrl.ts';

type PanoramicStatus = 'loading' | 'ready' | 'hidden';

const LIMIT = 10;
const INITIAL_MULTIPLIER = 4;
const INITIAL_LIMIT = INITIAL_MULTIPLIER * LIMIT;

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

type HomeProductCardProps = {
  product: ProductProps;
  isFavoriteUpdating: boolean;
  hideFavoriteButton: boolean;
  hasFavoriteError: boolean;
  onFavoriteToggle: (slug: string) => void;
  onProductClick: (slug: string) => void;
};

const HomeProductCard = memo(function HomeProductCard({
  product,
  isFavoriteUpdating,
  hideFavoriteButton,
  hasFavoriteError,
  onFavoriteToggle,
  onProductClick,
}: HomeProductCardProps) {
  return (
    <ProductCard
      name={product.name}
      price={product.price}
      image={product.images[0] ?? ''}
      alt={product.imageAlts?.[0]}
      onClick={() => onProductClick(product.slug)}
      isFavorite={product.isFavorite ?? false}
      isFavoriteUpdating={isFavoriteUpdating}
      hasFavoriteError={hasFavoriteError}
      favoriteErrorTarget="button"
      hideFavoriteButton={hideFavoriteButton}
      showFavoriteUpdatingOverlay={false}
      onFavoriteToggle={() => onFavoriteToggle(product.slug)}
    />
  );
});

export default function HomePage() {
  const navigate = useNavigate();
  const { status: authStatus } = useAuth();
  const { categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [panoramicStatus, setPanoramicStatus] = useState<PanoramicStatus>('loading');
  const [panoramicCategories, setPanoramicCategories] = useState<typeof categories>([]);

  const [fetchTrigger, setFetchTrigger] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const pageRef = useRef(1);

  useEffect(() => {
    let active = true;

    if (isCategoriesLoading) {
      setPanoramicStatus('loading');
      return () => {
        active = false;
      };
    }

    if (categories.length > 0) {
      setPanoramicCategories(categories);
      setPanoramicStatus('ready');
      return () => {
        active = false;
      };
    }

    if (categoriesError) {
      setPanoramicStatus('hidden');
      return () => {
        active = false;
      };
    }

    void getRandomCategory()
      .then(({ data }) => {
        if (!active) return;

        if (data) {
          setPanoramicCategories([data]);
          setPanoramicStatus('ready');
          return;
        }

        setPanoramicStatus('hidden');
      })
      .catch(() => {
        if (!active) return;

        setPanoramicStatus('hidden');
      });

    return () => {
      active = false;
    };
  }, [categories, categoriesError, isCategoriesLoading]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const fetchPage = async () => {
      try {
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!active) return; // Prevent double fetch in React Strict Mode

        if (pageRef.current === 1) {
          const res = await getProducts({ page: 1, pageSize: INITIAL_LIMIT });
          if (!active) return;

          const data = res.data || [];

          const combined = data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            price: product.price ?? 0,
            slug: product.slug,
            images: resolveImageUrls(product.images),
            imageAlts: product.imageAlts,
            category: product.category ?? '',
            isFavorite: product.isFavorite,
          }));

          const uniqueProducts: typeof combined = [];
          const seen = new Set<string>();
          for (const p of combined) {
            if (!seen.has(p.slug)) {
              seen.add(p.slug);
              uniqueProducts.push(p);
            }
          }

          setProducts(uniqueProducts);
          pageRef.current = INITIAL_LIMIT / LIMIT + 1;
          if (data.length < INITIAL_LIMIT) {
            setHasMore(false);
          }
        } else {
          const res = await getProducts({ page: pageRef.current, pageSize: LIMIT });
          if (!active) return;

          const data = res.data || [];
          const newProducts = data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            price: product.price ?? 0,
            slug: product.slug,
            images: resolveImageUrls(product.images),
            imageAlts: product.imageAlts,
            category: product.category ?? '',
            isFavorite: product.isFavorite ?? false,
          }));

          setProducts((prev) => {
            const existingSlugs = new Set(prev.map((p) => p.slug));
            return [...prev, ...newProducts.filter((p) => !existingSlugs.has(p.slug))];
          });

          pageRef.current += 1;
          if (data.length < LIMIT) {
            setHasMore(false);
          }
        }
      } catch {
        setError('Nie udało się załadować produktów.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void fetchPage();

    return () => {
      active = false;
    };
  }, [fetchTrigger]); // Only triggers on mount and when fetchTrigger changes!

  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '0px 0px 3000px 0px' }
    );

    if (observerNodeRef.current) {
      observer.observe(observerNodeRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && !isLoading && hasMore) {
      setFetchTrigger((prev) => prev + 1);
    }
  }, [isIntersecting, isLoading, hasMore]);

  const { toggleFavorite, pendingFavoriteSlugs, failedFavoriteSlugs } = useFavoriteToggle(
    products,
    setProducts
  );

  const handleProductClick = useCallback(
    (productSlug: string) => navigate(RENT_ROUTES.product(productSlug)),
    [navigate]
  );

  return (
    <div>
      {panoramicStatus !== 'hidden' && (
        <div className="w-full">
          {panoramicStatus === 'loading' ? (
            <PanoramicImagePlaceholder />
          ) : (
            <PanoramicCarousel
              categories={panoramicCategories}
              onCategoryClick={(slug) => navigate(getCategorySearchPath(slug))}
            />
          )}
        </div>
      )}

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
        <ProductCardGrid className="my-4">
          {products.map((product) => (
            <HomeProductCard
              key={product.slug}
              product={product}
              isFavoriteUpdating={pendingFavoriteSlugs.has(product.slug)}
              hasFavoriteError={failedFavoriteSlugs.has(product.slug)}
              hideFavoriteButton={authStatus !== 'authenticated'}
              onFavoriteToggle={toggleFavorite}
              onProductClick={handleProductClick}
            />
          ))}
        </ProductCardGrid>
      )}
      {hasMore && !error && (
        <div ref={observerNodeRef} className="flex h-20 w-full items-center justify-center pb-8">
          {isLoading && <ActivityIndicator size={44} />}
        </div>
      )}
    </div>
  );
}
