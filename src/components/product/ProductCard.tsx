import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import ButtonCore from '../core/ButtonCore.tsx';

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
  const HeartElem = isFavorite ? (
    <Heart
      className="self-end right-10"
      onClick={onFavoriteToggle}
      fill="#FF0000"
      strokeWidth={0}
    />
  ) : (
    <Heart
      className="self-end right-10 stroke-neutral-400"
      onClick={onFavoriteToggle}
      strokeWidth={1}
    />
  );

  return (
    <div className="flex h-[400px] w-52 flex-col gap-2 rounded-xl bg-neutral-100 p-4">
      <motion.div
        key={String(isFavorite)}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1.0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="self-end"
      >
        {HeartElem}
      </motion.div>

      <div className="h-44 w-full">
        <img src={image} alt={alt} className="h-full w-full object-contain" />
      </div>

      <p className="line-clamp-2 min-h-12 text-center font-medium">{name}</p>

      <div className="mt-auto">
        <p className="mb-2 text-center text-xl font-bold">{price} zł / doba</p>
        <ButtonCore text="Szczegóły" onClick={onClick} className="w-full p-2" />
      </div>
    </div>
  );
}
