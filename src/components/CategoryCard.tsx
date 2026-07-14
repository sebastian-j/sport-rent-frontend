import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { getCategorySearchPath } from '../features/search/categoryUtils.ts';

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
  small: 'h-[16rem] w-1/2',
  medium: 'h-[16rem] w-full',
  large: 'h-[32rem] w-full',
};

const IMAGE_WIDTH_CLASSES: Record<CategoryCardProps['size'], string> = {
  small: 'w-1/3',
  medium: 'w-1/3',
  large: 'w-1/2',
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
  const sizeClasses = SIZE_CLASSES[size];
  const imageWidthClasses = IMAGE_WIDTH_CLASSES[size];
  const flexRow = imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse';

  return (
    <motion.div
      whileHover={{ scale: 1.015, boxShadow: '0 12px 30px rgb(0 0 0 / 0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={twMerge(
        `relative flex cursor-pointer select-none bg-app-surface hover:z-10 ${sizeClasses} ${flexRow}`,
        className
      )}
      onClick={() => navigate(getCategorySearchPath(categorySlug))}
    >
      <div className={`${imageWidthClasses} h-full shrink-0 overflow-hidden`}>
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div
        className={twMerge(
          'flex flex-col justify-center px-4',
          invertedText ? 'text-app-textInverted' : 'text-app-textNeutral'
        )}
      >
        <p className="text-3xl font-semibold">{title}</p>
        <p className="text-app-textNeutralSoft">{description}</p>
      </div>
    </motion.div>
  );
}
