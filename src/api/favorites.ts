import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type FavoritesResponse = components['schemas']['FavoritesResponse'];
export const getFavorites = async () => api.GET('/favorites');
export const addFavorite = async (productSlug: string) =>
  api.POST('/favorites/{product_slug}', {
    params: {
      path: {
        product_slug: productSlug,
      },
    },
  });
export const removeFavorite = async (productSlug: string) =>
  api.DELETE('/favorites/{product_slug}', {
    params: {
      path: {
        product_slug: productSlug,
      },
    },
  });
