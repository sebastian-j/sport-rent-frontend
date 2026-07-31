import { AnimatePresence, motion } from 'motion/react';

import ActivityIndicator from '../../components/core/ActivityIndicator.tsx';
import { useCardTilt } from '../../components/core/useCardTilt.ts';
import FavoriteButton from './FavoriteButton.tsx';

export const PRODUCT_CARD_WIDTH = 300;

const PRODUCT_IMAGE_SIZE = { width: PRODUCT_CARD_WIDTH, height: 224 } as const;
const PRODUCT_CARD_CONTENT_HEIGHT = 120;
type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  alt: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  isFavoriteUpdating?: boolean;
  showFavoriteUpdatingOverlay?: boolean;
  hasFavoriteError?: boolean;
  favoriteErrorTarget?: 'card' | 'button';
  hideFavoriteButton?: boolean;
};

export default function ProductCard({
  name,
  price,
  image,
  alt,
  onClick,
  isFavorite,
  onFavoriteToggle,
  isFavoriteUpdating = false,
  showFavoriteUpdatingOverlay = true,
  hasFavoriteError = false,
  favoriteErrorTarget = 'card',
  hideFavoriteButton = false,
}: ProductCardProps) {
  const { cardStyle, imageStyle, hoverAnimation, handlePointerMove, resetTilt } = useCardTilt();
  const cardHoverAnimation = hoverAnimation ? { scale: hoverAnimation.scale } : undefined;
  const hasCardFavoriteError = hasFavoriteError && favoriteErrorTarget === 'card';
  const hasButtonFavoriteError = hasFavoriteError && favoriteErrorTarget === 'button';

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={cardHoverAnimation}
      animate={hasCardFavoriteError ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={
        hasCardFavoriteError
          ? { duration: 0.4, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 280, damping: 24 }
      }
      style={{
        width: '100%',
        maxWidth: PRODUCT_CARD_WIDTH,
        ...cardStyle,
      }}
      aria-busy={showFavoriteUpdatingOverlay && isFavoriteUpdating}
      className={`relative flex transform-gpu cursor-pointer select-none flex-col overflow-hidden rounded-xl border-[1px] bg-app-surfaceSoft shadow-none ring-2 transition-[filter,border-color,box-shadow] duration-300 ease-linear hover:z-10 hover:shadow-[0_16px_32px_rgb(0_0_0_/_0.16)] ${
        hasCardFavoriteError
          ? 'border-app-danger ring-app-danger'
          : 'border-app-borderSoft ring-transparent'
      } ${showFavoriteUpdatingOverlay && isFavoriteUpdating ? 'grayscale' : ''}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={showFavoriteUpdatingOverlay && isFavoriteUpdating}
        aria-label={`Zobacz szczegóły produktu: ${name}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-surfaceStrong"
      />

      {!hideFavoriteButton && (
        <FavoriteButton
          productName={name}
          isFavorite={isFavorite}
          onToggle={onFavoriteToggle}
          isUpdating={isFavoriteUpdating}
          hasError={hasButtonFavoriteError}
        />
      )}

      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ aspectRatio: `${PRODUCT_IMAGE_SIZE.width} / ${PRODUCT_IMAGE_SIZE.height}` }}
      >
        <motion.img
          src={image}
          alt={alt}
          className="h-full w-full object-cover"
          style={imageStyle}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1 bg-gradient-to-b from-transparent via-app-surface via-70% to-app-surface" />
        <AnimatePresence>
          {showFavoriteUpdatingOverlay && isFavoriteUpdating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
            >
              <ActivityIndicator
                label={`Usuwanie ${name} z ulubionych`}
                size={32}
                className="rounded-full bg-app-surface/90 p-3 text-app-textStrong shadow-lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="flex shrink-0 flex-col bg-app-surface px-4 py-3"
        style={{ height: PRODUCT_CARD_CONTENT_HEIGHT }}
      >
        <p className="line-clamp-2 min-h-12 text-center font-medium">{name}</p>
        <p className="mt-auto text-center text-xl font-bold">{price} zł / doba</p>
      </div>
    </motion.div>
  );
}
