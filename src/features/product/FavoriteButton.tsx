import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

const FAVORITE_FILL_CLIP = {
  favorite:
    'polygon(0% -8%, 12.5% -11%, 25% -12%, 37.5% -11%, 50% -8%, 62.5% -5%, 75% -4%, 87.5% -5%, 100% -8%, 100% 108%, 0% 108%)',
  notFavorite:
    'polygon(0% 104%, 12.5% 101%, 25% 100%, 37.5% 101%, 50% 104%, 62.5% 107%, 75% 108%, 87.5% 107%, 100% 104%, 100% 100%, 0% 100%)',
} as const;

type FavoriteButtonProps = {
  productName: string;
  isFavorite?: boolean;
  onToggle?: () => void;
  isUpdating?: boolean;
  hasError?: boolean;
  variant?: 'surface' | 'transparent';
  layout?: 'overlay' | 'inline';
};

export default function FavoriteButton({
  productName,
  isFavorite = false,
  onToggle,
  isUpdating = false,
  hasError = false,
  variant = 'surface',
  layout = 'overlay',
}: FavoriteButtonProps) {
  return (
    <motion.div
      animate={hasError ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={
        hasError
          ? { duration: 0.4, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 280, damping: 24 }
      }
      className={`rounded-full ring-2 transition-[box-shadow] duration-300 ${
        layout === 'overlay' ? 'absolute right-3 top-3 z-20' : 'relative shrink-0'
      } ${hasError ? 'ring-app-danger' : 'ring-transparent'}`}
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
        whileTap={{ scale: 0.88 }}
        transition={{ scale: { duration: 0.08, ease: 'easeOut' } }}
        className={`rounded-full p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-surfaceStrong disabled:cursor-wait ${
          variant === 'surface' ? 'bg-app-surface/90 shadow-sm' : 'bg-transparent'
        }`}
      >
        <span className="relative block size-6">
          <Heart
            className={`absolute inset-0 size-6 transition-colors duration-150 ${
              isFavorite ? 'text-app-danger' : 'text-app-textMuted'
            }`}
            fill="none"
            strokeWidth={1}
          />

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="absolute inset-0 size-6 text-app-danger"
          >
            <motion.path
              d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
              fill="currentColor"
              initial={false}
              animate={{
                clipPath: isFavorite ? FAVORITE_FILL_CLIP.favorite : FAVORITE_FILL_CLIP.notFavorite,
              }}
              transition={{ duration: 0.36, ease: 'easeInOut' }}
            />
          </svg>
        </span>
      </motion.button>
    </motion.div>
  );
}
