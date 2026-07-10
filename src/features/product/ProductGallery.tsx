import { useState } from 'react';
import { getProductBySlug } from '../../assets/products/products';
import { type ProductProps } from './productProps';

export default function ProductGallery({ product }: { product: ProductProps }) {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const mockProduct = getProductBySlug('kask-rowerowy');
  const images = [product.image, mockProduct?.image]; // different images for tests

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 align-middle">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={product.alt}
              className={`h-[12vh] w-auto rounded-lg border-[2px] ${index === selectedImage ? 'border-app-border' : 'border-app-borderSoft'}`}
              onClick={() => setSelectedImage(index)}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <img src={images[selectedImage]} alt={product.alt} className="w-[30vw] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
