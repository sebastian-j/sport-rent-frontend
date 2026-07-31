import { ArrowUpDown, Funnel, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getCategoriesCount, getProducts, type ProductCountQuery } from '../../api/product.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import DualRangeSlider from '../../components/core/DualRangeSlider.tsx';
import PageSelector from '../../components/core/PageSelector.tsx';
import type { SelectOption } from '../../components/core/Select.tsx';
import SortToggles from '../../components/core/SortToggles.tsx';
import type { ProductProps } from '../../features/product/productProps.ts';
import CategoryFilter, { type CategoryFacets } from '../../features/search/CategoryFilter.tsx';
import { toCategorySlug } from '../../features/search/categoryUtils.ts';
import SearchProductCard from '../../features/search/SearchProductCard.tsx';
import SearchProductCardPlaceholder from '../../features/search/SearchProductCardPlaceholder.tsx';
import { useProductSearchParams } from '../../features/search/useProductSearchParams.ts';
import type { SortDirection } from '../../types/search.ts';
import { getErrorMessage } from '../../utils/getErrorMessage.ts';

const PAGE_SIZE = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 200;
const DEFAULT_SEARCH_ERROR = 'Nie udało się pobrać produktów.';

const SORT_OPTIONS = [
  { value: 'name', label: 'Nazwa' },
  { value: 'price', label: 'Cena' },
] as const satisfies readonly SelectOption[];
type ProductSortField = (typeof SORT_OPTIONS)[number]['value'];
const SORT_FIELDS = SORT_OPTIONS.map((option) => option.value);

type MobilePanel = 'filters' | 'sorting' | null;

type SearchControlsPanelProps = {
  mobilePanel: MobilePanel;
  onOpenMobilePanel: (panel: Exclude<MobilePanel, null>) => void;
  sortField: ProductSortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: ProductSortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function SearchControlsPanel({
  mobilePanel,
  onOpenMobilePanel,
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
  pageNumber,
  totalPages,
  onPageChange,
}: SearchControlsPanelProps) {
  return (
    <ContentPanel className="h-fit w-full min-w-0 flex-none flex-row justify-between gap-2 p-2">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onOpenMobilePanel('filters')}
          aria-label="Otwórz filtry"
          aria-expanded={mobilePanel === 'filters'}
          aria-controls="mobile-search-panel"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-surfaceStrong text-app-textInverted lg:hidden"
        >
          <Funnel size={20} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onOpenMobilePanel('sorting')}
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
            onValueChange={onSortFieldChange}
            onDirectionChange={onSortDirectionChange}
          />
        </div>
      </div>

      <div className="shrink-0">
        <PageSelector pageNumber={pageNumber} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </ContentPanel>
  );
}

const toProductProps = (product: {
  id: number;
  name: string;
  description?: string | null;
  price?: number | null;
  slug: string;
  images?: string[] | null;
  imageAlts?: string[] | null;
  category?: string | null;
  sizes?: { size: string; description?: string | null }[] | null;
}): ProductProps => ({
  id: product.id,
  name: product.name,
  description: product.description ?? '',
  price: product.price ?? 0,
  slug: product.slug,
  images: product.images ?? [],
  imageAlts: product.imageAlts ?? [product.name],
  category: product.category ?? '',
  sizes: product.sizes ?? [],
});

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFacets, setCategoryFacets] = useState<CategoryFacets>({ categories: [] });
  const [searchResults, setSearchResults] = useState<ProductProps[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<number>>(new Set());
  const prefersReducedMotion = useReducedMotion();

  const categorySlugs = useMemo(
    () =>
      categoryFacets.categories
        .filter((category) => category.productCount > 0)
        .map((category) => category.slug),
    [categoryFacets]
  );

  const {
    query: searchQuery,
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
    totalPages,
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    sortFields: SORT_FIELDS,
    defaultSortField: 'name',
    categorySlugs,
  });
  const [appliedMinPrice, appliedMaxPrice] = appliedPriceRange;
  const [priceRange, setPriceRange] = useState<[number, number]>(appliedPriceRange);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>(null);
  const selectedCategoryKey = selectedCategorySlugs.join(',');
  const selectedCategoryNames = useMemo(() => {
    if (!selectedCategoryKey) return undefined;

    const selectedSlugs = selectedCategoryKey.split(',');

    return selectedSlugs.flatMap((selectedSlug) => {
      const category = categoryFacets.categories.find(({ slug }) => slug === selectedSlug);
      return category ? [category.name] : [];
    });
  }, [categoryFacets, selectedCategoryKey]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.key]);

  useEffect(() => {
    let ignoreResponse = false;

    setIsSearchLoading(true);
    setError(null);

    void getProducts({
      query: searchQuery || null,
      sort: sortField,
      order: sortDirection,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
      category: selectedCategoryNames,
      page: pageNumber,
      pageSize: PAGE_SIZE,
    })
      .then(({ data, error: requestError }) => {
        if (ignoreResponse) return;

        if (requestError || !data) {
          setSearchResults([]);
          setError(getErrorMessage(requestError, DEFAULT_SEARCH_ERROR));
          return;
        }

        setSearchResults(data.map(toProductProps));
      })
      .catch(() => {
        if (!ignoreResponse) {
          setSearchResults([]);
          setError(DEFAULT_SEARCH_ERROR);
        }
      })
      .finally(() => {
        if (!ignoreResponse) setIsSearchLoading(false);
      });

    return () => {
      ignoreResponse = true;
    };
  }, [
    appliedMaxPrice,
    appliedMinPrice,
    pageNumber,
    searchQuery,
    selectedCategoryNames,
    sortDirection,
    sortField,
  ]);

  const countQuery = useMemo<ProductCountQuery>(
    () => ({
      query: searchQuery || null,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
    }),
    [appliedMaxPrice, appliedMinPrice, searchQuery]
  );

  useEffect(() => {
    let active = true;

    getCategoriesCount(countQuery).then((countsRes) => {
      if (!active) return;

      const countsData = countsRes.data;
      if (countsData) {
        const categories = countsData[0];
        if (!Array.isArray(categories)) return;

        const totalCount = Number(countsData[1]);
        setTotalPages(Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));
        setCategoryFacets({
          categories: categories.map((category, index) => ({
            id: index + 1,
            slug: toCategorySlug(category.name),
            name: category.name,
            productCount: category.count,
          })),
        });
      }
    });

    return () => {
      active = false;
    };
  }, [countQuery]);

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
    <div className="mx-auto flex w-full max-w-[1400px] gap-4 p-4 [overflow-anchor:none] sm:p-6 md:p-8 lg:gap-8">
      <ContentPanel className="sticky top-20 hidden h-fit max-h-[calc(100vh-5rem)] w-64 flex-none self-start gap-6 overflow-y-auto lg:flex">
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
          facets={categoryFacets}
          selectedCategorySlugs={selectedCategorySlugs}
          onSelectedCategorySlugsChange={setSelectedCategorySlugs}
        />
      </ContentPanel>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <SearchControlsPanel
          mobilePanel={mobilePanel}
          onOpenMobilePanel={setMobilePanel}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
          pageNumber={pageNumber}
          totalPages={totalPages}
          onPageChange={setPageNumber}
        />

        <motion.div
          layout={isSearchLoading ? false : 'size'}
          className="flex w-full flex-col gap-4"
          aria-busy={isSearchLoading}
          aria-live="polite"
          style={{ transformOrigin: 'top' }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
          }
        >
          <AnimatePresence mode="popLayout">
            {isSearchLoading ? (
              <motion.div
                key="loading-products"
                className="overflow-hidden"
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{
                  height: { duration: 0.24, ease: 'linear' },
                  opacity: { duration: 0.14, delay: 0.08, ease: 'easeOut' },
                }}
              >
                <span className="sr-only">Ładowanie produktów...</span>
                <SearchProductCardPlaceholder />
              </motion.div>
            ) : error ? (
              <motion.p
                key="products-error"
                role="alert"
                className="py-12 text-center text-app-danger"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {error}
              </motion.p>
            ) : searchResults.length === 0 ? (
              <motion.p
                key="empty-products"
                className="py-12 text-center text-app-textMuted"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                Brak produktów spełniających wybrane kryteria.
              </motion.p>
            ) : (
              <motion.div
                key="products"
                className="flex w-full flex-col gap-4"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {searchResults.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SearchProductCard
                      product={product}
                      onClick={() => navigate(`/product/${product.slug}`)}
                      onAddToCart={() => undefined}
                      isFavorite={favoriteProductIds.has(product.id)}
                      onFavoriteToggle={() =>
                        setFavoriteProductIds((currentIds) => {
                          const nextIds = new Set(currentIds);

                          if (nextIds.has(product.id)) {
                            nextIds.delete(product.id);
                          } else {
                            nextIds.add(product.id);
                          }

                          return nextIds;
                        })
                      }
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!isSearchLoading && searchResults.length >= 5 && (
          <SearchControlsPanel
            mobilePanel={mobilePanel}
            onOpenMobilePanel={setMobilePanel}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
            pageNumber={pageNumber}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        )}
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
                        facets={categoryFacets}
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
