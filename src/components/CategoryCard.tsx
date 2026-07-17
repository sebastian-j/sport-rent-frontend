import ButtonCore from './core/ButtonCore.tsx';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { getCategorySearchPath } from '../features/search/categoryUtils.ts';
import { useCardTilt } from './core/useCardTilt.ts';

type CategoryCardProps = {
  title: string;
  description: string;
  categorySlug: string;
  image: string;
  imagePosition: 'left' | 'right';
  size: 'small' | 'medium' | 'large';
  invertedText?: boolean;
  className?: string;
};

const SIZE_CLASSES: Record<CategoryCardProps['size'], string> = {
  small: 'h-[16rem] w-full min-[961px]:w-1/2',
  medium: 'h-[16rem] w-full',
  large: 'h-[32rem] w-full',
};

const IMAGE_WIDTH_CLASSES: Record<CategoryCardProps['size'], string> = {
  small: 'w-1/3',
  medium: 'w-1/3',
  large: 'w-1/3 min-[961px]:w-1/2',
};

const TILT_BY_SIZE: Record<
  CategoryCardProps['size'],
  {
    maxCardTiltDegrees: number;
    maxImageTiltDegrees: number;
    maxImageShiftPixels: number;
  }
> = {
  small: { maxCardTiltDegrees: 1.6, maxImageTiltDegrees: 0.55, maxImageShiftPixels: 1.25 },
  medium: { maxCardTiltDegrees: 1.25, maxImageTiltDegrees: 0.45, maxImageShiftPixels: 1 },
  large: { maxCardTiltDegrees: 0.8, maxImageTiltDegrees: 0.3, maxImageShiftPixels: 0.75 },
};

export default function CategoryCard({
  title,
  description,
  categorySlug,
  image,
  imagePosition,
  size,
  invertedText,
  className,
}: CategoryCardProps) {
  const navigate = useNavigate();
  const { cardStyle, imageStyle, hoverAnimation, handlePointerMove, resetTilt } = useCardTilt(
    TILT_BY_SIZE[size]
  );
  const sizeClasses = SIZE_CLASSES[size];
  const imageWidthClasses = IMAGE_WIDTH_CLASSES[size];
  const flexRow = imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse';

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={hoverAnimation}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      style={cardStyle}
      className={twMerge(
        `relative flex cursor-pointer select-none bg-app-surface hover:z-10 ${sizeClasses} ${flexRow}`,
        className
      )}
      onClick={() => navigate(getCategorySearchPath(categorySlug))}
    >
      <div className={`${imageWidthClasses} h-full shrink-0 overflow-hidden`}>
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          style={imageStyle}
        />
      </div>
      <div
        className={twMerge(
          'flex min-w-0 flex-col justify-center px-3 min-[961px]:px-4',
          invertedText ? 'text-app-textInverted' : 'text-app-textNeutral'
        )}
      >
        <p className="break-words text-xl font-semibold sm:text-2xl min-[961px]:text-3xl">
          {title}
        </p>
        <p className="break-words text-app-textNeutralSoft">{description}</p>
      </div>
    </motion.div>
  );
}
