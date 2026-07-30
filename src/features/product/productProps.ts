export type ProductProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  imageAlts: string[];
  category: string;
  sizes?: { size: string; description?: string | null; available?: boolean }[];
  isFavorite?: boolean;
};
