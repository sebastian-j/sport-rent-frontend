export type ProductProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  alt: string;
  category: string;
  sizes?: { size: string; description?: string | null; available?: boolean }[];
};
