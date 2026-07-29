export const RENT_ROUTES = {
  home: '/rent',
  favorites: '/rent/favorites',
  product: (slug: string) => `/rent/product/${slug}`,
  search: '/rent/search',
  profile: '/rent/profile',
  cart: '/rent/cart',
  summary: '/rent/summary',
} as const;
