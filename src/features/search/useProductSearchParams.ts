import { useSearchParams } from 'react-router-dom';

import type { SortDirection } from '../../types/search.ts';

type PriceRange = [number, number];

type ProductSearchParamsOptions<SortField extends string> = {
  totalPages: number;
  minPrice: number;
  maxPrice: number;
  sortFields: readonly SortField[];
  defaultSortField: SortField;
  categorySlugs: readonly string[];
  subcategorySlugs?: readonly string[];
  manufacturerSlugs?: readonly string[];
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useProductSearchParams<SortField extends string>({
  totalPages,
  minPrice,
  maxPrice,
  sortFields,
  defaultSortField,
  categorySlugs,
  subcategorySlugs = [],
  manufacturerSlugs = [],
}: ProductSearchParamsOptions<SortField>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query')?.trim() ?? '';
  const lastPage = Math.max(1, totalPages);
  const pageParam = searchParams.get('page');
  const parsedPage = pageParam === null ? 1 : Number(pageParam);
  const pageNumber = Number.isInteger(parsedPage) ? clamp(parsedPage, 1, lastPage) : 1;
  const sortParam = searchParams.get('sort') ?? '';
  const sortField = sortFields.includes(sortParam as SortField)
    ? (sortParam as SortField)
    : defaultSortField;
  const sortDirection: SortDirection = searchParams.get('order') === 'desc' ? 'desc' : 'asc';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const parsedMinPrice = minPriceParam === null ? minPrice : Number(minPriceParam);
  const parsedMaxPrice = maxPriceParam === null ? maxPrice : Number(maxPriceParam);
  const selectedMinPrice = Number.isFinite(parsedMinPrice)
    ? clamp(parsedMinPrice, minPrice, maxPrice)
    : minPrice;
  const selectedMaxPrice = Number.isFinite(parsedMaxPrice)
    ? clamp(parsedMaxPrice, minPrice, maxPrice)
    : maxPrice;
  const priceRange: PriceRange =
    selectedMinPrice <= selectedMaxPrice
      ? [selectedMinPrice, selectedMaxPrice]
      : [minPrice, maxPrice];
  const availableCategorySlugs = new Set(categorySlugs);
  const availableSubcategorySlugs = new Set(subcategorySlugs);
  const selectedCategorySlugs = searchParams
    .getAll('category')
    .filter((categorySlug) => availableCategorySlugs.has(categorySlug));
  const selectedSubcategorySlugs = searchParams
    .getAll('subcategory')
    .filter((subcategorySlug) => availableSubcategorySlugs.has(subcategorySlug));
  const availableManufacturerSlugs = new Set(manufacturerSlugs);
  const selectedManufacturerSlugs = searchParams
    .getAll('manufacturer')
    .filter((manufacturerSlug) => availableManufacturerSlugs.has(manufacturerSlug));

  const setPageNumber = (nextPageNumber: number) => {
    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.set('page', String(clamp(nextPageNumber, 1, lastPage)));
      return nextSearchParams;
    });
  };

  const setSortField = (nextSortField: SortField) => {
    if (!sortFields.includes(nextSortField)) return;

    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.set('sort', nextSortField);
      nextSearchParams.set('page', '1');
      return nextSearchParams;
    });
  };

  const setSortDirection = (nextSortDirection: SortDirection) => {
    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.set('order', nextSortDirection);
      nextSearchParams.set('page', '1');
      return nextSearchParams;
    });
  };

  const setPriceRange = ([nextMinPrice, nextMaxPrice]: PriceRange) => {
    setSearchParams(
      (previousSearchParams) => {
        const nextSearchParams = new URLSearchParams(previousSearchParams);

        if (nextMinPrice === minPrice) {
          nextSearchParams.delete('minPrice');
        } else {
          nextSearchParams.set('minPrice', String(nextMinPrice));
        }

        if (nextMaxPrice === maxPrice) {
          nextSearchParams.delete('maxPrice');
        } else {
          nextSearchParams.set('maxPrice', String(nextMaxPrice));
        }

        nextSearchParams.set('page', '1');
        return nextSearchParams;
      },
      { replace: true }
    );
  };

  const setCategoryAndSubcategorySlugs = (
    nextSelectedCategorySlugs: readonly string[],
    nextSelectedSubcategorySlugs: readonly string[]
  ) => {
    const selectedCategories = new Set(nextSelectedCategorySlugs);
    const selectedSubcategories = new Set(nextSelectedSubcategorySlugs);

    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.delete('category');
      nextSearchParams.delete('subcategory');
      categorySlugs
        .filter((categorySlug) => selectedCategories.has(categorySlug))
        .forEach((categorySlug) => nextSearchParams.append('category', categorySlug));
      subcategorySlugs
        .filter((subcategorySlug) => selectedSubcategories.has(subcategorySlug))
        .forEach((subcategorySlug) => nextSearchParams.append('subcategory', subcategorySlug));
      nextSearchParams.set('page', '1');
      return nextSearchParams;
    });
  };

  const setSelectedCategorySlugs = (nextSelectedCategorySlugs: readonly string[]) => {
    setCategoryAndSubcategorySlugs(nextSelectedCategorySlugs, selectedSubcategorySlugs);
  };

  const setSelectedSubcategorySlugs = (nextSelectedSubcategorySlugs: readonly string[]) => {
    setCategoryAndSubcategorySlugs(selectedCategorySlugs, nextSelectedSubcategorySlugs);
  };

  const setManufacturerSlugs = (nextSelectedManufacturerSlugs: readonly string[]) => {
    const selectedManufacturers = new Set(nextSelectedManufacturerSlugs);

    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.delete('manufacturer');
      manufacturerSlugs
        .filter((manufacturerSlug) => selectedManufacturers.has(manufacturerSlug))
        .forEach((manufacturerSlug) => nextSearchParams.append('manufacturer', manufacturerSlug));
      nextSearchParams.set('page', '1');
      return nextSearchParams;
    });
  };

  return {
    query,
    pageNumber,
    sortField,
    sortDirection,
    priceRange,
    selectedCategorySlugs,
    selectedSubcategorySlugs,
    selectedManufacturerSlugs,
    setPageNumber,
    setSortField,
    setSortDirection,
    setPriceRange,
    setSelectedCategorySlugs,
    setSelectedSubcategorySlugs,
    setCategoryAndSubcategorySlugs,
    setManufacturerSlugs,
  };
}
