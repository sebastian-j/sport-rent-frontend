import { ShoppingCart } from 'lucide-react';

import ButtonCore from '../../components/core/ButtonCore.tsx';
import FavoriteButton from '../product/FavoriteButton.tsx';
import type { ProductProps } from '../product/productProps.ts';
import { markdownToPlainText } from './markdownToPlainText.ts';

type SearchProductCardProps = {
  product: ProductProps;
  onClick?: () => void;
  onAddToCart?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
};

export default function SearchProductCard({
  product,
  onClick,
  onAddToCart,
  isFavorite = false,
  onFavoriteToggle,
}: SearchProductCardProps) {
  const plainDescription = markdownToPlainText(product.description);

  return (
    <article className="relative flex h-80 w-full transform-gpu cursor-pointer select-none overflow-hidden rounded-xl border border-app-borderSoft bg-app-surfaceSoft transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none md:h-48">
      <button
        type="button"
        onClick={onClick}
        aria-label={`Zobacz szczegóły produktu: ${product.name}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-surfaceStrong"
      />

      <FavoriteButton
        productName={product.name}
        isFavorite={isFavorite}
        onToggle={onFavoriteToggle}
        variant="transparent"
      />

      <div className="relative w-[clamp(8rem,40%,13rem)] shrink-0 overflow-hidden md:w-60">
        <img
          src={product.images[0] ?? ''}
          alt={product.alt}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-r from-transparent via-app-surface to-app-surface" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-app-surface p-3 sm:p-4 md:flex-row md:items-stretch md:gap-5">
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 className="line-clamp-2 text-lg font-semibold text-app-text sm:text-xl">
            {product.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-app-textMuted sm:text-base">
            {plainDescription}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-auto pt-2">
              <p className="text-sm font-medium text-app-textMuted">Dostępne rozmiary</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.sizes.map(({ size }) => (
                  <span
                    key={size}
                    className="rounded-md border border-app-borderSoft bg-app-surfaceSoft px-2 py-0.5 text-sm font-medium text-app-text"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch justify-end gap-3 border-t border-app-borderSoft pt-3 md:w-48 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="whitespace-nowrap text-xl font-bold text-app-text md:text-center">
            {product.price} zł / doba
          </p>
          <ButtonCore
            onClick={onAddToCart}
            ariaLabel={`Dodaj ${product.name} do koszyka`}
            className="relative z-20 flex items-center justify-center gap-2 px-4 py-3 font-medium"
          >
            <ShoppingCart size={20} aria-hidden="true" />
            <span>Dodaj do koszyka</span>
          </ButtonCore>
        </div>
      </div>
    </article>
  );
}
