import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addFavorite, removeFavorite } from '../../api/favorites.ts';
import { getProducts } from '../../api/product.ts';
import ferratyImage from '../../assets/categories/ferraty.png';
import namiotyImage from '../../assets/categories/namioty.png';
import przyczepkiImage from '../../assets/categories/przyczepki.png';
import roweryImage from '../../assets/categories/rowery.png';
import panoramicImage from '../../assets/panoramic_small.png';
import CategoryBar from '../../components/CategoryBar.tsx';
import CategoryCard from '../../components/CategoryCard.tsx';
import CategoryCardSlider from '../../components/CategoryCardSlider.tsx';
import PanoramicImage from '../../components/PanoramicImage.tsx';
import ProductCard from '../../features/product/ProductCard.tsx';
import ProductCardGrid from '../../features/product/ProductCardGrid.tsx';
import type { ProductProps } from '../../features/product/productProps.ts';

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
  const [pendingFavoriteSlugs, setPendingFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const [failedFavoriteSlugs, setFailedFavoriteSlugs] = useState<Set<string>>(() => new Set());
  const errorTimeouts = useRef<Map<string, number>>(new Map());
  const [products, setProducts] = useState<ProductProps[]>([]);
  const calculateItemsPerRow = () => {
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const availableWidth = containerWidth - 32;
    return Math.max(1, Math.floor((availableWidth + 16) / 272)) + 1;
  };

  const calculateInitialRows = () => {
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const observerMargin = 800;
    const rowHeight = 360;
    const gridOffsetTop = 500;
    const neededRows = Math.ceil((viewportHeight + observerMargin - gridOffsetTop) / rowHeight);
    return Math.max(2, neededRows);
  };

  const [itemsPerRow, setItemsPerRow] = useState(calculateItemsPerRow);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerRow(calculateItemsPerRow());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [fetchTrigger, setFetchTrigger] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerRowRef = useRef(itemsPerRow);
  itemsPerRowRef.current = itemsPerRow;

  const productsLengthRef = useRef(products.length);
  productsLengthRef.current = products.length;

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const fetchPage = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!active) return; // Prevent double fetch in React Strict Mode

        const limit = itemsPerRowRef.current;

        if (productsLengthRef.current === 0) {
          const initialRows = calculateInitialRows();
          const initialLimit = initialRows * limit;

          const res = await getProducts(1, initialLimit);
          if (!active) return;

          const data = res.data || [];

          const combined = data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            price: product.price ?? 0,
            slug: product.slug,
            images: product.images ?? [],
            alt: product.alt ?? product.name,
            category: product.category ?? '',
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
          if (data.length < initialLimit) {
            setHasMore(false);
          }
        } else {
          const actualPageToFetch = Math.floor(productsLengthRef.current / limit) + 1;
          const res = await getProducts(actualPageToFetch, limit);
          if (!active) return;

          const data = res.data || [];
          const newProducts = data.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            price: product.price ?? 0,
            slug: product.slug,
            images: product.images ?? [],
            alt: product.alt ?? product.name,
            category: product.category ?? '',
          }));

          setProducts((prev) => {
            const existingSlugs = new Set(prev.map((p) => p.slug));
            return [...prev, ...newProducts.filter((p) => !existingSlugs.has(p.slug))];
          });

          if (data.length < limit) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Błąd pobierania produktów:', error);
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
      { rootMargin: '0px 0px 800px 0px' }
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

  const toggleFavorite = async (productSlug: string) => {
    if (pendingFavoriteSlugs.has(productSlug)) return;

    const isFavorite = favoritesSlugs.has(productSlug);
    setPendingFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(productSlug));
    setFailedFavoriteSlugs((currentSlugs) => {
      const nextSlugs = new Set(currentSlugs);
      nextSlugs.delete(productSlug);
      return nextSlugs;
    });

    try {
      const { error } = isFavorite
        ? await removeFavorite(productSlug)
        : await addFavorite(productSlug);

      if (error) throw error;

      setFavoritesSlugs((currentSlugs) => {
        const nextSlugs = new Set(currentSlugs);

        if (isFavorite) {
          nextSlugs.delete(productSlug);
        } else {
          nextSlugs.add(productSlug);
        }

        return nextSlugs;
      });
    } catch (error) {
      console.error(
        `Błąd ${isFavorite ? 'usuwania produktu z' : 'dodawania produktu do'} ulubionych (${productSlug}):`,
        error
      );
      setFailedFavoriteSlugs((currentSlugs) => new Set(currentSlugs).add(productSlug));

      const previousTimeout = errorTimeouts.current.get(productSlug);
      if (previousTimeout) window.clearTimeout(previousTimeout);

      const timeout = window.setTimeout(() => {
        setFailedFavoriteSlugs((currentSlugs) => {
          const nextSlugs = new Set(currentSlugs);
          nextSlugs.delete(productSlug);
          return nextSlugs;
        });
        errorTimeouts.current.delete(productSlug);
      }, 1200);

      errorTimeouts.current.set(productSlug, timeout);
    } finally {
      setPendingFavoriteSlugs((currentSlugs) => {
        const nextSlugs = new Set(currentSlugs);
        nextSlugs.delete(productSlug);
        return nextSlugs;
      });
    }
  };

  useEffect(() => {
    const activeErrorTimeouts = errorTimeouts.current;

    return () => {
      activeErrorTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      activeErrorTimeouts.clear();
    };
  }, []);

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
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            name={product.name}
            price={product.price}
            image={product.images[0] ?? ''}
            alt={product.alt}
            onClick={() => navigate(`/product/${product.slug}`)}
            isFavorite={favoritesSlugs.has(product.slug)}
            isFavoriteUpdating={pendingFavoriteSlugs.has(product.slug)}
            hasFavoriteError={failedFavoriteSlugs.has(product.slug)}
            favoriteErrorTarget="button"
            showFavoriteUpdatingOverlay={false}
            onFavoriteToggle={() => void toggleFavorite(product.slug)}
          />
        ))}
      </ProductCardGrid>

      {hasMore && (
        <div ref={observerNodeRef} className="flex h-20 w-full items-center justify-center pb-8">
          {isLoading && (
            <div className="size-8 animate-spin rounded-full border-4 border-app-border border-t-app-textStrong" />
          )}
        </div>
      )}
    </div>
  );
}
