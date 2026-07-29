export const ROOT_ROUTE = '/';

export const RENT_ROUTES = {
  home: '/rent',
  favorites: '/rent/favorites',
  product: (slug: string) => `/rent/product/${slug}`,
  search: '/rent/search',
  profile: '/rent/profile',
  cart: '/rent/cart',
  summary: '/rent/summary',
} as const;

export const SERVICE_ROUTES = {
  home: '/service',
} as const;

export const BOOT_FITTING_ROUTES = {
  home: '/boot-fitting',
} as const;

const isRouteInSection = (pathname: string, sectionHome: string) =>
  pathname === sectionHome || pathname.startsWith(`${sectionHome}/`);

export const getSectionHomeRoute = (pathname: string) => {
  if (isRouteInSection(pathname, RENT_ROUTES.home)) return RENT_ROUTES.home;
  if (isRouteInSection(pathname, SERVICE_ROUTES.home)) return SERVICE_ROUTES.home;
  if (isRouteInSection(pathname, BOOT_FITTING_ROUTES.home)) return BOOT_FITTING_ROUTES.home;

  return ROOT_ROUTE;
};
