import { useParams } from 'react-router-dom';
import { getProductById } from '../assets/products/products';
import ProductGallery from '../components/product/ProductGallery';
import AddToCart from '../components/product/AddToCart';
import { useState } from 'react';

export default function ProductPage() {
  const { id } = useParams();
  const productId = id ? parseInt(id) : null;
  const product = productId ? getProductById(productId) : null;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeClick = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  };

  return (
    <div className="flex flex-col bg-white mx-[5vw]">
      <main className="flex-grow mt-[2vh]">
        <h1 className="text-6xl font-semibold mb-4 text-center text-[#193556]">{product?.name}</h1>
        <div className="mb-8 text-lg text-gray-600 flex flex-row gap-4 mt-[2vh] mb-[2vh]">
          <div className="font-bold w-full items-center justify-center flex flex-col gap-4 h-full w-full">
            <ProductGallery product={product} />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <AddToCart product={product} />
          </div>
        </div>
        {product?.sizes && (
          <div className="text-lg text-gray-600">
            <p className="font-semibold text-5xl text-[#193556]">Rozmiar</p>
            <div className="flex flex-row gap-4 mt-[2vh]">
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className={
                    selectedSize === size
                      ? 'flex flex-col gap-2 p-4 border rounded-lg border-black w-[5vw] h-[5vw] items-center justify-center cursor-pointer bg-gray-700 text-white'
                      : 'flex flex-col gap-2 p-4 border rounded-lg border-black w-[5vw] h-[5vw] items-center justify-center cursor-pointer hover:bg-gray-200 text-[#193556]'
                  }
                  onClick={() => handleSizeClick(size)}
                >
                  <p className="text-2xl font-semibold">{size}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-lg text-[#193556] mt-[2vh] mb-[2vh]">
          <p className="font-semibold text-5xl text-[#193556]">Opis produktu</p>
          <p className="mt-[2vh] text-2xl">{product?.description}</p>
        </div>
      </main>
    </div>
  );
}
