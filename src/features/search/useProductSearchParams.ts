import { useSearchParams } from 'react-router-dom';
import type { SortDirection } from '../../types/search.ts';

type PriceRange = [number, number];

type ProductSearchParamsOptions = {
  totalPages: number;
  minPrice: number;
  maxPrice: number;
  sortFields: readonly string[];
  defaultSortField: string;
  categorySlugs: readonly string[];
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useProductSearchParams({
  totalPages,
  minPrice,
  maxPrice,
  sortFields,
  defaultSortField,
  categorySlugs,
}: ProductSearchParamsOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const lastPage = Math.max(1, totalPages);
  const pageParam = searchParams.get('page');
  const parsedPage = pageParam === null ? 1 : Number(pageParam);
  const pageNumber = Number.isInteger(parsedPage) ? clamp(parsedPage, 1, lastPage) : 1;
  const sortParam = searchParams.get('sort') ?? '';
  const sortField = sortFields.includes(sortParam) ? sortParam : defaultSortField;
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
  const selectedCategorySlugs = searchParams
    .getAll('category')
    .filter((categorySlug) => availableCategorySlugs.has(categorySlug));

  const setPageNumber = (nextPageNumber: number) => {
    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.set('page', String(clamp(nextPageNumber, 1, lastPage)));
      return nextSearchParams;
    });
  };

  const setSortField = (nextSortField: string) => {
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

  const setSelectedCategorySlugs = (nextSelectedCategorySlugs: readonly string[]) => {
    const selectedSlugs = new Set(nextSelectedCategorySlugs);

    setSearchParams((previousSearchParams) => {
      const nextSearchParams = new URLSearchParams(previousSearchParams);
      nextSearchParams.delete('category');
      categorySlugs
        .filter((categorySlug) => selectedSlugs.has(categorySlug))
        .forEach((categorySlug) => nextSearchParams.append('category', categorySlug));
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
    setPageNumber,
    setSortField,
    setSortDirection,
    setPriceRange,
    setSelectedCategorySlugs,
  };
}
