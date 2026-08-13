import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { useParams } from 'react-router-dom';

import { getProductBySlug } from '../../api/product.ts';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import Markdown from '../../components/core/Markdown.tsx';
import PageHeader from '../../components/core/PageHeader.tsx';
import { useAuth } from '../../features/auth/authContext.ts';
import AddToCart from '../../features/product/AddToCart.tsx';
import ProductGallery from '../../features/product/ProductGallery.tsx';
import type { ProductProps } from '../../features/product/productProps.ts';
import { useFavoriteToggle } from '../../features/product/useFavoriteToggle.ts';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { status: authStatus } = useAuth();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const productList = useMemo(() => (product ? [product] : []), [product]);
  const setProductList = useCallback<Dispatch<SetStateAction<ProductProps[]>>>(
    (action) => {
      setProduct((currentProduct) => {
        if (!currentProduct) return currentProduct;

        const currentList = [currentProduct];
        const nextList = typeof action === 'function' ? action(currentList) : action;

        return nextList[0] ?? null;
      });
    },
    []
  );
  const { toggleFavorite, pendingFavoriteSlugs, failedFavoriteSlugs } = useFavoriteToggle(
    productList,
    setProductList
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      if (slug) {
        try {
          const { data, error: apiError } = await getProductBySlug(slug);
          if (apiError || !data) {
            setProduct(null);
            if (apiError) {
              setError('Nie udało się załadować produktu.');
            }
          } else {
            setProduct({
              id: data.id,
              name: data.name,
              description: data.description ?? '',
              price: data.price ?? 0,
              slug: data.slug,
              images: data.images ?? [],
              imageAlts: data.imageAlts,
              category: data.category ?? '',
              sizes:
                data.sizes?.map((size) => ({
                  ...size,
                  available: Math.random() < 0.5,
                })) ?? [],
              isFavorite: data.isFavorite,
            });
          }
        } catch (err) {
          console.error(err);
          setProduct(null);
          setError('Nie udało się załadować produktu. Spróbuj ponownie później.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setProduct(null);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div role="status" className="mt-[10vh] text-center text-5xl text-app-text">
        Ładowanie produktu <LoadingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center px-4 py-20 text-center text-red-500">
        <p className="mb-4 text-2xl font-semibold">{error}</p>
        <button
          onClick={() => {
            // Trigger a re-render by doing window.location.reload() or we could add a retry mechanism
            window.location.reload();
          }}
          className="rounded-full bg-red-100 px-6 py-2 font-medium text-red-600 transition-colors hover:bg-red-200"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 text-center text-4xl font-semibold text-app-danger lg:px-8">
        Produkt nie został znaleziony
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col bg-app-surface">
      <PageHeader titleClassName="text-app-text">{product.name}</PageHeader>
      <div className="flex-grow px-4">
        <div className="mb-[2vh] flex flex-col gap-6 text-lg text-app-textMuted min-[961px]:flex-row min-[961px]:items-start min-[961px]:gap-4">
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 self-start font-bold min-[961px]:sticky min-[961px]:top-[110px]">
            <ProductGallery key={product.id} product={product} />
          </div>
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 self-start min-[961px]:sticky min-[961px]:top-[110px]">
            <AddToCart
              key={product.id}
              product={product}
              isFavorite={product.isFavorite ?? false}
              isFavoriteUpdating={pendingFavoriteSlugs.has(product.slug)}
              hasFavoriteError={failedFavoriteSlugs.has(product.slug)}
              hideFavoriteButton={authStatus !== 'authenticated'}
              onFavoriteToggle={() => void toggleFavorite(product.slug)}
            />
          </div>
        </div>
        {product.sizes?.some((sizeOption) => sizeOption.description) && (
          <section className="text-app-text">
            <h2 className="text-2xl font-semibold">Rozmiary</h2>
            <div className="mt-[2vh] flex flex-col gap-2">
              {product.sizes.map(
                (sizeOption) =>
                  sizeOption.description && (
                    <p key={sizeOption.size} className="text-lg font-semibold">
                      {sizeOption.size}: {sizeOption.description}
                    </p>
                  )
              )}
            </div>
          </section>
        )}
        <div className="border-b-2 border-app-borderSoft mt-[2vh]" />
        <div className="mb-[2vh] mt-[2vh] text-lg text-app-text">
          <Markdown>{product.description}</Markdown>
        </div>
      </div>
    </div>
  );
}
