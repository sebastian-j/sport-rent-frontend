import { RENT_ROUTES } from '../../routes.ts';

export const toCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getCategorySearchPath = (categorySlug: string) =>
  `${RENT_ROUTES.search}?${new URLSearchParams({
    category: categorySlug,
    page: '1',
    sort: 'name',
    order: 'asc',
  }).toString()}`;
