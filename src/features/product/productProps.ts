export type ProductProps = {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  image: string;
  alt: string;
  category: string;
  sizes?: string[];
  sizes_description?: Record<string, string | undefined>;
};
