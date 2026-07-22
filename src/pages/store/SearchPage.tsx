import { ArrowUpDown, Funnel, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { PRODUCTS } from '../../assets/products/products.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import DualRangeSlider from '../../components/core/DualRangeSlider.tsx';
import PageSelector from '../../components/core/PageSelector.tsx';
import type { SelectOption } from '../../components/core/Select.tsx';
import SortToggles from '../../components/core/SortToggles.tsx';
import CategoryFilter, { type CategoryFacets } from '../../features/search/CategoryFilter.tsx';
import { toCategorySlug } from '../../features/search/categoryUtils.ts';
import { useProductSearchParams } from '../../features/search/useProductSearchParams.ts';

const TOTAL_PAGES = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 200;
const SORT_OPTIONS: readonly SelectOption[] = [
  { value: 'name', label: 'Nazwa' },
  { value: 'price', label: 'Cena' },
];
const SORT_FIELDS = SORT_OPTIONS.map((option) => option.value);
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
  const [mobilePanel, setMobilePanel] = useState<'filters' | 'sorting' | null>(null);

  useEffect(() => {
    setPriceRange((currentPriceRange) =>
      currentPriceRange[0] === appliedMinPrice && currentPriceRange[1] === appliedMaxPrice
        ? currentPriceRange
        : [appliedMinPrice, appliedMaxPrice]
    );
  }, [appliedMinPrice, appliedMaxPrice]);

  useEffect(() => {
    if (!mobilePanel) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobilePanel(null);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobilePanel]);

  useEffect(() => {
    const filtersExpanded = window.matchMedia('(min-width: 1024px)');
    const sortingExpanded = window.matchMedia('(min-width: 768px)');

    const closeExpandedPanel = () => {
      setMobilePanel((currentPanel) => {
        if (currentPanel === 'filters' && filtersExpanded.matches) return null;
        if (currentPanel === 'sorting' && sortingExpanded.matches) return null;

        return currentPanel;
      });
    };

    filtersExpanded.addEventListener('change', closeExpandedPanel);
    sortingExpanded.addEventListener('change', closeExpandedPanel);

    return () => {
      filtersExpanded.removeEventListener('change', closeExpandedPanel);
      sortingExpanded.removeEventListener('change', closeExpandedPanel);
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] gap-4 p-4 sm:p-6 md:p-8 lg:gap-8">
      <ContentPanel className="sticky top-32 hidden h-fit max-h-[calc(100vh-8rem)] w-64 flex-none self-start gap-6 overflow-y-auto lg:flex">
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
        <ContentPanel className="sticky top-16 z-40 h-fit w-full min-w-0 flex-none flex-row justify-between gap-2 self-start p-2 md:top-24">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobilePanel('filters')}
              aria-label="Otwórz filtry"
              aria-expanded={mobilePanel === 'filters'}
              aria-controls="mobile-search-panel"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-surfaceStrong text-app-textInverted lg:hidden"
            >
              <Funnel size={20} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobilePanel('sorting')}
              aria-label="Otwórz sortowanie"
              aria-expanded={mobilePanel === 'sorting'}
              aria-controls="mobile-search-panel"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-surfaceStrong text-app-textInverted md:hidden"
            >
              <ArrowUpDown size={20} aria-hidden="true" />
            </button>

            <div className="hidden md:block">
              <SortToggles
                value={sortField}
                options={SORT_OPTIONS}
                direction={sortDirection}
                onValueChange={setSortField}
                onDirectionChange={setSortDirection}
              />
            </div>
          </div>

          <div className="shrink-0">
            <PageSelector
              pageNumber={pageNumber}
              totalPages={TOTAL_PAGES}
              onPageChange={setPageNumber}
            />
          </div>
        </ContentPanel>
      </div>

      <AnimatePresence>
        {mobilePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className={`fixed inset-0 z-[60] ${
              mobilePanel === 'filters' ? 'lg:hidden' : 'md:hidden'
            }`}
          >
            <button
              type="button"
              aria-label={`Zamknij ${mobilePanel === 'filters' ? 'filtry' : 'sortowanie'}`}
              className="absolute inset-0 bg-app-surfaceStrong/60"
              onClick={() => setMobilePanel(null)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 z-10 h-full w-[min(85vw,20rem)]"
            >
              <ContentPanel className="h-full w-full items-stretch gap-6 overflow-y-auto rounded-none border-y-0 border-l-0 bg-app-surfaceElevated p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-app-borderSoft pb-4">
                  <h2 id="mobile-search-panel-title" className="text-xl font-semibold">
                    {mobilePanel === 'filters' ? 'Filtry' : 'Sortowanie'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setMobilePanel(null)}
                    aria-label={`Zamknij ${mobilePanel === 'filters' ? 'filtry' : 'sortowanie'}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-app-text hover:bg-app-surfaceSoft"
                  >
                    <X size={22} aria-hidden="true" />
                  </button>
                </div>

                <div
                  id="mobile-search-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="mobile-search-panel-title"
                  className="flex flex-col gap-6"
                >
                  {mobilePanel === 'filters' ? (
                    <>
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
                    </>
                  ) : (
                    <SortToggles
                      value={sortField}
                      options={SORT_OPTIONS}
                      direction={sortDirection}
                      onValueChange={setSortField}
                      onDirectionChange={setSortDirection}
                    />
                  )}
                </div>
              </ContentPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
