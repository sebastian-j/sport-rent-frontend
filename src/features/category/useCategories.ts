import { useEffect, useState } from 'react';

import { getCategories, type CategoryItem } from '../../api/category.ts';

type CategoriesState = {
  categories: CategoryItem[];
  isLoading: boolean;
  error: Error | null;
};

let cachedCategories: CategoryItem[] | null = null;
let categoriesRequest: Promise<CategoryItem[]> | null = null;

const loadCategories = async (): Promise<CategoryItem[]> => {
  if (cachedCategories) return cachedCategories;

  if (!categoriesRequest) {
    categoriesRequest = getCategories().then(({ data, error }) => {
      if (error || !data) {
        categoriesRequest = null;
        throw error ?? new Error('Nie udało się załadować kategorii.');
      }

      cachedCategories = data;
      return data;
    });
  }

  return categoriesRequest;
};

export default function useCategories() {
  const [state, setState] = useState<CategoriesState>(() => ({
    categories: cachedCategories ?? [],
    isLoading: cachedCategories === null,
    error: null,
  }));

  useEffect(() => {
    if (cachedCategories) return;

    let active = true;

    void loadCategories()
      .then((categories) => {
        if (!active) return;

        setState({
          categories,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!active) return;

        setState({
          categories: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error('Nie udało się załadować kategorii.'),
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
