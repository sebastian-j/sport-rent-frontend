import type { CategoryItem } from '../../api/category.ts';
import { RENT_ROUTES } from '../../routes.ts';

export const toCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const buildSearchPath = (params: Record<string, string>) =>
  `${RENT_ROUTES.search}?${new URLSearchParams({
    ...params,
    page: '1',
    sort: 'name',
    order: 'asc',
  }).toString()}`;

export const getCategorySearchPath = (categorySlug: string) =>
  buildSearchPath({ category: categorySlug });

export const getSubcategorySearchPath = (categorySlug: string, subcategorySlug: string) =>
  buildSearchPath({
    category: categorySlug,
    subcategory: subcategorySlug,
  });

export const getParentCategorySlugs = (categories: readonly CategoryItem[]) =>
  categories.map((category) => category.slug);

export const getSubcategorySlugs = (categories: readonly CategoryItem[]) =>
  categories.flatMap((category) => category.subcategories.map((subcategory) => subcategory.slug));

export const getParentCategoryNameBySlug = (categories: readonly CategoryItem[]) => {
  const nameBySlug = new Map<string, string>();

  for (const category of categories) {
    nameBySlug.set(category.slug, category.name);
  }

  return nameBySlug;
};

export const getSubcategoryNameBySlug = (categories: readonly CategoryItem[]) => {
  const nameBySlug = new Map<string, string>();

  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      nameBySlug.set(subcategory.slug, subcategory.name);
    }
  }

  return nameBySlug;
};

export const getParentSlugBySubcategorySlug = (categories: readonly CategoryItem[]) => {
  const parentBySubcategorySlug = new Map<string, string>();

  for (const category of categories) {
    for (const subcategory of category.subcategories) {
      parentBySubcategorySlug.set(subcategory.slug, category.slug);
    }
  }

  return parentBySubcategorySlug;
};
