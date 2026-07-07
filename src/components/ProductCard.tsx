import { Heart } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="flex flex-col w-52 bg-neutral-100 pt-6 p-4 gap-2 rounded-xl">
      <motion.div
        key={String(isFavorite)}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1.0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="self-end"
      >
        {HeartElem}
      </motion.div>
      <img src={image} alt={alt} width={200} height={200} />
      <p className="self-center text-center">{name}</p>
      <p className="self-center font-bold text-xl text-center">{price}zł / doba</p>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="bg-neutral-950 text-slate-50 rounded-lg h-10"
      >
        Dodaj do koszyka
      </motion.button>
    </div>
  );
}
