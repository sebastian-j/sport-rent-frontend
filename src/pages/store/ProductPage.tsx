import { useParams } from 'react-router-dom';
import ProductGallery from '../../features/product/ProductGallery.tsx';
import AddToCart from '../../features/product/AddToCart.tsx';
import { useEffect, useState } from 'react';
import { getProductBySlug } from '../../assets/products/products.ts';
import type { ProductProps } from '../../features/product/productProps.ts';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductProps | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      if (slug) {
        try {
          const fetchedProduct = await getProductBySlug(slug);
          setProduct((fetchedProduct as ProductProps) || null);
        } catch (error) {
          console.error(error);
          setProduct(null);
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
      <div className="text-center text-5xl text-app-text mt-[10vh]">Ładowanie produktu...</div>
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
    <div className="mx-auto flex w-full max-w-[1400px] flex-col bg-app-surface px-4">
      <main className="flex-grow mt-[2vh]">
        <h1 className="mb-4 text-center text-4xl font-semibold text-app-text">{product?.name}</h1>
        <div className="mb-[2vh] mt-[2vh] flex flex-col gap-6 text-lg text-app-textMuted min-[961px]:flex-row min-[961px]:items-start min-[961px]:gap-4">
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 self-start font-bold min-[961px]:sticky min-[961px]:top-[110px]">
            <ProductGallery key={product.id} product={product} />
          </div>
          <div className="flex h-fit w-full flex-col items-center justify-center gap-4 self-start min-[961px]:sticky min-[961px]:top-[110px]">
            <AddToCart key={product.id} product={product} />
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
        <div className="mb-[2vh] mt-[2vh] text-lg text-app-text">
          <h2 className="text-2xl font-semibold text-app-text">Opis produktu</h2>
          <p className="mt-[2vh] text-lg">{product.description}</p>
        </div>
      </main>
    </div>
  );
}
