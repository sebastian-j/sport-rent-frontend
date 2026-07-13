import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../assets/products/products.ts';
import type { ComboBoxOption } from '../components/core/ComboBox.tsx';
import ContentPanel from '../components/core/ContentPanel.tsx';
import DualRangeSlider from '../components/core/DualRangeSlider.tsx';
import PageSelector from '../components/core/PageSelector.tsx';
import SortToggles, { type SortDirection } from '../components/core/SortToggles.tsx';
import CategoryFilter, { type CategoryFacets } from '../features/search/CategoryFilter.tsx';

const TOTAL_PAGES = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 200;
const SORT_OPTIONS: readonly ComboBoxOption[] = [
  { value: 'name', label: 'Nazwa' },
  { value: 'price', label: 'Cena' },
];
const toCategorySlug = (category: string) =>
  category
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const PRODUCT_CATEGORY_FACETS = Array.from(
  new Set(PRODUCTS.map((product) => product.category))
).map((category, index) => ({
  id: index + 1,
  slug: toCategorySlug(category),
  name: category,
  productCount: PRODUCTS.filter((product) => product.category === category).length,
}));
const CATEGORY_FACETS: CategoryFacets = {
  categories: [
    ...PRODUCT_CATEGORY_FACETS,
    {
      id: PRODUCT_CATEGORY_FACETS.length + 1,
      slug: 'sporty-zimowe',
      name: 'Sporty zimowe',
      productCount: 0,
    },
  ],
};

const getPriceRange = (searchParams: URLSearchParams): [number, number] => {
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const parsedMinPrice = minPriceParam === null ? MIN_PRICE : Number(minPriceParam);
  const parsedMaxPrice = maxPriceParam === null ? MAX_PRICE : Number(maxPriceParam);
  const minPrice = Number.isFinite(parsedMinPrice)
    ? Math.min(MAX_PRICE, Math.max(MIN_PRICE, parsedMinPrice))
    : MIN_PRICE;
  const maxPrice = Number.isFinite(parsedMaxPrice)
    ? Math.min(MAX_PRICE, Math.max(MIN_PRICE, parsedMaxPrice))
    : MAX_PRICE;

  return minPrice <= maxPrice ? [minPrice, maxPrice] : [MIN_PRICE, MAX_PRICE];
};

const applyPriceParams = (
  searchParams: URLSearchParams,
  [minPrice, maxPrice]: [number, number]
) => {
  if (minPrice === MIN_PRICE) {
    searchParams.delete('minPrice');
  } else {
    searchParams.set('minPrice', String(minPrice));
  }

  if (maxPrice === MAX_PRICE) {
    searchParams.delete('maxPrice');
  } else {
    searchParams.set('maxPrice', String(maxPrice));
  }
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>(() => getPriceRange(searchParams));
  const [committedPriceRange, setCommittedPriceRange] = useState<[number, number]>(() =>
    getPriceRange(searchParams)
  );
  const [minPriceFromParams, maxPriceFromParams] = getPriceRange(searchParams);
  const sortFromParams = searchParams.get('sort') ?? '';
  const sortField = SORT_OPTIONS.some((option) => option.value === sortFromParams)
    ? sortFromParams
    : 'name';
  const sortDirection: SortDirection =
    searchParams.get('order') === 'desc' ? 'descending' : 'ascending';
  const pageFromParams = Number(searchParams.get('page'));
  const pageNumber =
    Number.isInteger(pageFromParams) && pageFromParams >= 1 && pageFromParams <= TOTAL_PAGES
      ? pageFromParams
      : 1;

  useEffect(() => {
    setPriceRange((currentPriceRange) =>
      currentPriceRange[0] === minPriceFromParams && currentPriceRange[1] === maxPriceFromParams
        ? currentPriceRange
        : [minPriceFromParams, maxPriceFromParams]
    );
    setCommittedPriceRange((currentPriceRange) =>
      currentPriceRange[0] === minPriceFromParams && currentPriceRange[1] === maxPriceFromParams
        ? currentPriceRange
        : [minPriceFromParams, maxPriceFromParams]
    );
  }, [minPriceFromParams, maxPriceFromParams]);

  const handlePriceRangeChangeEnd = (nextPriceRange: [number, number]) => {
    setCommittedPriceRange(nextPriceRange);
    setSearchParams(
      (previousSearchParams) => {
        const nextSearchParams = new URLSearchParams(previousSearchParams);
        applyPriceParams(nextSearchParams, nextPriceRange);
        nextSearchParams.set('page', '1');
        return nextSearchParams;
      },
      { replace: true }
    );
  };

  const handlePageChange = (nextPageNumber: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('page', String(nextPageNumber));
    nextSearchParams.set('sort', sortField);
    nextSearchParams.set('order', sortDirection === 'ascending' ? 'asc' : 'desc');
    applyPriceParams(nextSearchParams, committedPriceRange);
    setSearchParams(nextSearchParams);
  };

  const handleSortFieldChange = (nextSortField: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('sort', nextSortField);
    nextSearchParams.set('order', sortDirection === 'ascending' ? 'asc' : 'desc');
    applyPriceParams(nextSearchParams, committedPriceRange);
    nextSearchParams.set('page', '1');
    setSearchParams(nextSearchParams);
  };

  const handleSortDirectionChange = (nextSortDirection: SortDirection) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('sort', sortField);
    nextSearchParams.set('order', nextSortDirection === 'ascending' ? 'asc' : 'desc');
    applyPriceParams(nextSearchParams, committedPriceRange);
    nextSearchParams.set('page', '1');
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-row gap-8 p-8">
      <ContentPanel className="sticky top-32 h-fit max-h-[calc(100vh-8rem)] w-64 flex-none self-start overflow-y-auto gap-6">
        <DualRangeSlider
          label="Cena"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={priceRange}
          onChange={setPriceRange}
          onChangeEnd={handlePriceRangeChangeEnd}
          formatValue={(value) => `${value} zł`}
        />
        <CategoryFilter facets={CATEGORY_FACETS} />
      </ContentPanel>
      <div className="flex min-w-0 flex-1 flex-col">
        <ContentPanel className="sticky top-32 z-40 h-fit w-full min-w-0 flex-none flex-row justify-between self-start p-2">
          <SortToggles
            value={sortField}
            options={SORT_OPTIONS}
            direction={sortDirection}
            onValueChange={handleSortFieldChange}
            onDirectionChange={handleSortDirectionChange}
          />

          <PageSelector
            pageNumber={pageNumber}
            totalPages={TOTAL_PAGES}
            onPageChange={handlePageChange}
          />
        </ContentPanel>
        <div className="h-[2000px]" />
      </div>
    </div>
  );
}
