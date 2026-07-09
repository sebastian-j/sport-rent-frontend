export type ProductProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  category: string;
  description: string;
  sizes?: string[] | null;
};
