import { Heart } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent } from 'react';
import ButtonCore from '../../components/core/ButtonCore.tsx';

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

  const HeartElem = isFavorite ? (
    <Heart
      className="self-end right-10 text-app-danger"
      onClick={onFavoriteToggle}
      fill="currentColor"
      strokeWidth={0}
    />
  ) : (
    <Heart
      className="self-end right-10 text-app-textMuted"
      onClick={onFavoriteToggle}
      strokeWidth={1}
    />
  );

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
      className="relative flex h-[400px] w-64 transform-gpu flex-col gap-2 rounded-xl border-[1px] border-app-borderSoft bg-app-surfaceSoft p-4 hover:z-10"
    >
      <motion.div
        key={String(isFavorite)}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1.0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="self-end"
      >
        {HeartElem}
      </motion.div>

      <div className="flex w-full justify-center">
        <img src={image} alt={alt} className="max-h-44 max-w-full rounded-lg object-contain" />
      </div>

      <p className="line-clamp-2 min-h-12 text-center font-medium">{name}</p>

      <div className="mt-auto">
        <p className="mb-2 text-center text-xl font-bold">{price} zł / doba</p>
        <ButtonCore text="Szczegóły" onClick={onClick} className="w-full p-2" />
      </div>
    </motion.div>
  );
}
