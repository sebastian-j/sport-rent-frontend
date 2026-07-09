import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import ButtonCore from '../../components/core/ButtonCore.tsx';

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
    <div className="flex h-[400px] w-64 flex-col gap-2 rounded-xl bg-app-surfaceSoft border-app-borderSoft border-[1px] p-4">
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
    </div>
  );
}
