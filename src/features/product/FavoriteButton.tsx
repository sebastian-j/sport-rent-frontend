import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const FAVORITE_BUTTON_VARIANTS = {
  favorite: { scale: [0.85, 1] },
  notFavorite: { scale: [0.85, 1] },
};

type FavoriteButtonProps = {
  productName: string;
  isFavorite?: boolean;
  onToggle?: () => void;
  isUpdating?: boolean;
  hasError?: boolean;
  variant?: 'surface' | 'transparent';
};

export default function FavoriteButton({
  productName,
  isFavorite = false,
  onToggle,
  isUpdating = false,
  hasError = false,
  variant = 'surface',
}: FavoriteButtonProps) {
  return (
    <motion.div
      animate={hasError ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={
        hasError
          ? { duration: 0.4, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 280, damping: 24 }
      }
      className={`absolute right-3 top-3 z-20 rounded-full ring-2 transition-[box-shadow] duration-300 ${
        hasError ? 'ring-app-danger' : 'ring-transparent'
      }`}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        disabled={isUpdating}
        aria-busy={isUpdating}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Usuń ${productName} z ulubionych` : `Dodaj ${productName} do ulubionych`
        }
        initial={false}
        variants={FAVORITE_BUTTON_VARIANTS}
        animate={isFavorite ? 'favorite' : 'notFavorite'}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className={`rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-surfaceStrong disabled:cursor-wait ${
          variant === 'surface' ? 'bg-app-surface/90 shadow-sm' : 'bg-transparent'
        }`}
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

          {!isFavorite && !isUpdating && (
            <Heart
              className="absolute inset-0 size-6 text-app-textMuted"
              fill="none"
              strokeWidth={1}
            />
          )}

          {isUpdating && (
            <Heart
              className="absolute inset-0 size-6 text-app-textMuted"
              fill="currentColor"
              strokeWidth={0}
            />
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}
