import { Heart } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent } from 'react';

const MAX_TILT_DEGREES = 6;

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  alt: string;
  onClick?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
};

export default function ProductCard({
  name,
  price,
  image,
  alt,
  onClick,
  isFavorite,
  onFavoriteToggle,
}: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 240, damping: 24 });
  const rotateY = useSpring(rotateYValue, { stiffness: 240, damping: 24 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXValue.set(verticalPosition * -2 * MAX_TILT_DEGREES);
    rotateYValue.set(horizontalPosition * 2 * MAX_TILT_DEGREES);
  };

  const resetTilt = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { scale: 1.025, boxShadow: '0 16px 32px rgb(0 0 0 / 0.16)' }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="relative flex h-[340px] w-64 transform-gpu cursor-pointer select-none flex-col overflow-hidden rounded-xl border-[1px] border-app-borderSoft bg-app-surfaceSoft hover:z-10"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`Zobacz szczegóły produktu: ${name}`}
        className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-surfaceStrong"
      />

      <motion.button
        type="button"
        key={String(isFavorite)}
        onClick={onFavoriteToggle}
        aria-label={isFavorite ? `Usuń ${name} z ulubionych` : `Dodaj ${name} do ulubionych`}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1.0 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="absolute right-3 top-3 z-20 rounded-full bg-app-surface/90 p-2 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-surfaceStrong"
      >
        <Heart
          className={isFavorite ? 'text-app-danger' : 'text-app-textMuted'}
          fill={isFavorite ? 'currentColor' : 'none'}
          strokeWidth={isFavorite ? 0 : 1}
        />
      </motion.button>

      <div className="h-[220px] w-full shrink-0 overflow-hidden">
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-app-surface px-4 py-3">
        <p className="line-clamp-2 min-h-12 text-center font-medium">{name}</p>
        <p className="mt-auto text-center text-xl font-bold">{price} zł / doba</p>
      </div>
    </motion.div>
  );
}
