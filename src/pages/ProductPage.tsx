import { useParams } from 'react-router-dom';
import { getProductById } from '../assets/products/products';
import ProductGallery from '../features/product/ProductGallery';
import AddToCart from '../features/product/AddToCart';
import { useState } from 'react';

export default function ProductPage() {
  const { id } = useParams();
  const productId = id ? parseInt(id) : null;
  const product = productId ? getProductById(productId) : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="text-center text-5xl text-app-danger">Produkt nie został znaleziony</div>
    );
  }

  const handleSizeClick = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  };

  return (
    <div className="mx-[5vw] flex flex-col bg-app-surface">
      <main className="flex-grow mt-[2vh]">
        <h1 className="mb-4 text-center text-6xl font-semibold text-app-text">{product?.name}</h1>
        <div className="mb-[2vh] mt-[2vh] flex flex-row gap-4 text-lg text-app-textMuted">
          <div className="font-bold w-full items-center justify-center flex flex-col gap-4 h-full w-full">
            <ProductGallery product={product} />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <AddToCart product={product} selectedSize={selectedSize} />
          </div>
        </div>
        {product?.sizes && (
          <div className="text-lg text-app-textMuted">
            <p className="text-5xl font-semibold text-app-text">Rozmiar</p>
            <div className="flex flex-row gap-4 mt-[2vh]">
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className={
                    selectedSize === size
                      ? 'flex h-[5vw] w-[5vw] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-app-border bg-app-surfaceStrongNeutral p-4 text-app-textInverted'
                      : 'flex h-[5vw] w-[5vw] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-app-border p-4 text-app-text hover:bg-app-surfaceSoft'
                  }
                  onClick={() => handleSizeClick(size)}
                >
                  <p className="text-2xl font-semibold">{size}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-[2vh] mt-[2vh] text-lg text-app-text">
          <p className="text-5xl font-semibold text-app-text">Opis produktu</p>
          <p className="mt-[2vh] text-2xl">{product?.description}</p>
        </div>
      </main>
    </div>
  );
}
