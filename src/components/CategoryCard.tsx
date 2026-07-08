import ButtonCore from './core/ButtonCore.tsx';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

type CategoryCardProps = {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
  imagePosition: 'left' | 'right';
  size: 'small' | 'medium' | 'large';
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
  image,
  onClick,
  imagePosition,
  size,
  className,
}: CategoryCardProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const imageWidthClasses = IMAGE_WIDTH_CLASSES[size];
  const flexRow = imagePosition === 'left' ? 'flex-row' : 'flex-row-reverse';

  return (
    <motion.div
      whileHover={{ scale: 1.015, boxShadow: '0 12px 30px rgb(0 0 0 / 0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={twMerge(
        `relative flex hover:z-10 cursor-pointer bg-white ${sizeClasses} ${flexRow}`,
        className
      )}
      onClick={onClick}
    >
      <div className={`${imageWidthClasses} h-full shrink-0 overflow-hidden`}>
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center px-4">
        <p className="text-3xl font-semibold">{title}</p>
        <p className="text-neutral-600">{description}</p>
        {onClick && (
          <ButtonCore
            text="Rezerwuj teraz"
            onClick={onClick}
            className="px-8 py-4 mt-4 self-center"
          />
        )}
      </div>
    </motion.div>
  );
}
