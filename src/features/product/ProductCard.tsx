import { Heart } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent } from 'react';

const MAX_CARD_TILT_DEGREES = 3;
const MAX_IMAGE_TILT_DEGREES = 1;
const MAX_IMAGE_SHIFT_PIXELS = 2;
const PRODUCT_IMAGE_SIZE = { width: 256, height: 224 } as const;
const PRODUCT_CARD_CONTENT_HEIGHT = 120;

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
  const imageRotateXValue = useMotionValue(0);
  const imageRotateYValue = useMotionValue(0);
  const imageXValue = useMotionValue(0);
  const imageYValue = useMotionValue(0);
  const imageRotateX = useSpring(imageRotateXValue, { stiffness: 180, damping: 20 });
  const imageRotateY = useSpring(imageRotateYValue, { stiffness: 180, damping: 20 });
  const imageX = useSpring(imageXValue, { stiffness: 180, damping: 20 });
  const imageY = useSpring(imageYValue, { stiffness: 180, damping: 20 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXValue.set(verticalPosition * -2 * MAX_CARD_TILT_DEGREES);
    rotateYValue.set(horizontalPosition * 2 * MAX_CARD_TILT_DEGREES);
    imageRotateXValue.set(verticalPosition * 2 * MAX_IMAGE_TILT_DEGREES);
    imageRotateYValue.set(horizontalPosition * -2 * MAX_IMAGE_TILT_DEGREES);
    imageXValue.set(horizontalPosition * -2 * MAX_IMAGE_SHIFT_PIXELS);
    imageYValue.set(verticalPosition * -2 * MAX_IMAGE_SHIFT_PIXELS);
  };

  const resetTilt = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    imageRotateXValue.set(0);
    imageRotateYValue.set(0);
    imageXValue.set(0);
    imageYValue.set(0);
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
      style={{
        width: PRODUCT_IMAGE_SIZE.width,
        height: PRODUCT_IMAGE_SIZE.height + PRODUCT_CARD_CONTENT_HEIGHT,
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      className="relative flex transform-gpu cursor-pointer select-none flex-col overflow-hidden rounded-xl border-[1px] border-app-borderSoft bg-app-surfaceSoft hover:z-10"
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

      <div
        className="w-full shrink-0 overflow-hidden"
        style={{ height: PRODUCT_IMAGE_SIZE.height }}
      >
        <motion.img
          src={image}
          alt={alt}
          className="h-full w-full object-cover"
          style={{
            rotateX: imageRotateX,
            rotateY: imageRotateY,
            x: imageX,
            y: imageY,
            scale: 1.1,
            transformPerspective: 700,
          }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-app-surface px-4 py-3">
        <p className="line-clamp-2 min-h-12 text-center font-medium">{name}</p>
        <p className="mt-auto text-center text-xl font-bold">{price} zł / doba</p>
      </div>
    </motion.div>
  );
}
