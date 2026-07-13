import { useEffect, useState } from 'react';
import { PRODUCTS } from '../assets/products/products.ts';
import type { ComboBoxOption } from '../components/core/ComboBox.tsx';
import ContentPanel from '../components/core/ContentPanel.tsx';
import DualRangeSlider from '../components/core/DualRangeSlider.tsx';
import PageSelector from '../components/core/PageSelector.tsx';
import SortToggles from '../components/core/SortToggles.tsx';
import CategoryFilter, { type CategoryFacets } from '../features/search/CategoryFilter.tsx';
import { useProductSearchParams } from '../features/search/useProductSearchParams.ts';

const TOTAL_PAGES = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 200;
const SORT_OPTIONS: readonly ComboBoxOption[] = [
  { value: 'name', label: 'Nazwa' },
  { value: 'price', label: 'Cena' },
];
const SORT_FIELDS = SORT_OPTIONS.map((option) => option.value);
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
const CATEGORY_SLUGS = CATEGORY_FACETS.categories
  .filter((category) => category.productCount > 0)
  .map((category) => category.slug);

export default function SearchPage() {
  const {
    pageNumber,
    sortField,
    sortDirection,
    priceRange: appliedPriceRange,
    selectedCategorySlugs,
    setPageNumber,
    setSortField,
    setSortDirection,
    setPriceRange: setAppliedPriceRange,
    setSelectedCategorySlugs,
  } = useProductSearchParams({
    totalPages: TOTAL_PAGES,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    sortFields: SORT_FIELDS,
    defaultSortField: 'name',
    categorySlugs: CATEGORY_SLUGS,
  });
  const [appliedMinPrice, appliedMaxPrice] = appliedPriceRange;
  const [priceRange, setPriceRange] = useState<[number, number]>(appliedPriceRange);

  useEffect(() => {
    setPriceRange((currentPriceRange) =>
      currentPriceRange[0] === appliedMinPrice && currentPriceRange[1] === appliedMaxPrice
        ? currentPriceRange
        : [appliedMinPrice, appliedMaxPrice]
    );
  }, [appliedMinPrice, appliedMaxPrice]);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-row gap-8 p-8">
      <ContentPanel className="sticky top-32 h-fit max-h-[calc(100vh-8rem)] w-64 flex-none self-start overflow-y-auto gap-6">
        <DualRangeSlider
          label="Cena"
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={priceRange}
          onChange={setPriceRange}
          onChangeEnd={setAppliedPriceRange}
          formatValue={(value) => `${value} zł`}
        />
        <CategoryFilter
          facets={CATEGORY_FACETS}
          selectedCategorySlugs={selectedCategorySlugs}
          onSelectedCategorySlugsChange={setSelectedCategorySlugs}
        />
      </ContentPanel>
      <div className="flex min-w-0 flex-1 flex-col">
        <ContentPanel className="sticky top-32 z-40 h-fit w-full min-w-0 flex-none flex-row justify-between self-start p-2">
          <SortToggles
            value={sortField}
            options={SORT_OPTIONS}
            direction={sortDirection}
            onValueChange={setSortField}
            onDirectionChange={setSortDirection}
          />

          <PageSelector
            pageNumber={pageNumber}
            totalPages={TOTAL_PAGES}
            onPageChange={setPageNumber}
          />
        </ContentPanel>
      </div>
    </div>
  );
}
