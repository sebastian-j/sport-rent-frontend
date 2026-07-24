import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import ActivityIndicator from '../../components/core/ActivityIndicator.tsx';
import { useCardTilt } from '../../components/core/useCardTilt.ts';

export const PRODUCT_CARD_WIDTH = 256;

const PRODUCT_IMAGE_SIZE = { width: PRODUCT_CARD_WIDTH, height: 224 } as const;
const PRODUCT_CARD_CONTENT_HEIGHT = 120;
const FAVORITE_BUTTON_VARIANTS = {
  favorite: { scale: [0.85, 1] },
  notFavorite: { scale: [0.85, 1] },
};

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
}: ProductCardProps) {
  const { cardStyle, imageStyle, hoverAnimation, handlePointerMove, resetTilt } = useCardTilt();
  const hasCardFavoriteError = hasFavoriteError && favoriteErrorTarget === 'card';
  const hasButtonFavoriteError = hasFavoriteError && favoriteErrorTarget === 'button';

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={hoverAnimation}
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
      className={`relative flex transform-gpu cursor-pointer select-none flex-col overflow-hidden rounded-xl border-[1px] bg-app-surfaceSoft ring-2 transition-[filter,border-color,box-shadow] duration-300 ease-linear hover:z-10 ${
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

      <motion.div
        animate={hasButtonFavoriteError ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
        transition={
          hasButtonFavoriteError
            ? { duration: 0.4, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 280, damping: 24 }
        }
        className={`absolute right-3 top-3 z-20 rounded-full ring-2 transition-[box-shadow] duration-300 ${
          hasButtonFavoriteError ? 'ring-app-danger' : 'ring-transparent'
        }`}
      >
        <motion.button
          type="button"
          onClick={onFavoriteToggle}
          disabled={isFavoriteUpdating}
          aria-busy={isFavoriteUpdating}
          aria-label={isFavorite ? `Usuń ${name} z ulubionych` : `Dodaj ${name} do ulubionych`}
          initial={false}
          variants={FAVORITE_BUTTON_VARIANTS}
          animate={isFavorite ? 'favorite' : 'notFavorite'}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="rounded-full bg-app-surface/90 p-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-surfaceStrong disabled:cursor-wait"
        >
          <span className="relative block size-6">
            <Heart
              className="absolute inset-0 size-6 text-app-textMuted"
              fill="currentColor"
              strokeWidth={0}
            />

            <AnimatePresence initial={false}>
              <motion.span
                key={String(isFavorite)}
                initial={{
                  clipPath: isFavorite ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
                }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Heart
                  className={`size-6 ${isFavorite ? 'text-app-danger' : 'text-app-surface'}`}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </motion.span>
            </AnimatePresence>

            {!isFavorite && !isFavoriteUpdating && (
              <Heart
                className="absolute inset-0 size-6 text-app-textMuted"
                fill="none"
                strokeWidth={1}
              />
            )}

            {isFavoriteUpdating && (
              <Heart
                className="absolute inset-0 size-6 text-app-textMuted"
                fill="currentColor"
                strokeWidth={0}
              />
            )}
          </span>
        </motion.button>
      </motion.div>

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
