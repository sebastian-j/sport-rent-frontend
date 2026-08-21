import type { CategoryItem } from '../../api/category.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';

export type CategoryFacet = {
  id: number | string;
  slug: string;
  name: string;
  productCount: number;
};

export type CategoryFacets = {
  categories: readonly CategoryFacet[];
};

type CategoryFilterProps = {
  facets: CategoryFacets;
  catalogCategories: readonly CategoryItem[];
  selectedCategorySlugs: readonly string[];
  selectedSubcategorySlugs: readonly string[];
  onCategoryFiltersChange: (
    categorySlugs: readonly string[],
    subcategorySlugs: readonly string[]
  ) => void;
};

export default function CategoryFilter({
  facets,
  catalogCategories,
  selectedCategorySlugs,
  selectedSubcategorySlugs,
  onCategoryFiltersChange,
}: CategoryFilterProps) {
  const facetCategorySlugs = new Set(facets.categories.map((category) => category.slug));
  const validSelectedCategorySlugs = selectedCategorySlugs.filter((categorySlug) =>
    facetCategorySlugs.has(categorySlug)
  );
  const subcategorySlugsByParent = new Map(
    catalogCategories.map((category) => [
      category.slug,
      category.subcategories.map((subcategory) => subcategory.slug),
    ])
  );
  const validSelectedSubcategorySlugs = selectedSubcategorySlugs.filter((subcategorySlug) => {
    const parentSlug = catalogCategories.find((category) =>
      category.subcategories.some((subcategory) => subcategory.slug === subcategorySlug)
    )?.slug;

    return parentSlug !== undefined && validSelectedCategorySlugs.includes(parentSlug);
  });

  const clearFilters = () => onCategoryFiltersChange([], []);

  const handleCategoryChange = (categorySlug: string, isSelected: boolean) => {
    const nextSelectedCategorySlugs = new Set(validSelectedCategorySlugs);
    const nextSelectedSubcategorySlugs = new Set(validSelectedSubcategorySlugs);

    if (isSelected) {
      nextSelectedCategorySlugs.add(categorySlug);
    } else {
      nextSelectedCategorySlugs.delete(categorySlug);
      for (const subcategorySlug of subcategorySlugsByParent.get(categorySlug) ?? []) {
        nextSelectedSubcategorySlugs.delete(subcategorySlug);
      }
    }

    onCategoryFiltersChange(
      facets.categories
        .filter((category) => nextSelectedCategorySlugs.has(category.slug))
        .map((category) => category.slug),
      [...nextSelectedSubcategorySlugs]
    );
  };

  const handleSubcategoryChange = (
    categorySlug: string,
    subcategorySlug: string,
    isSelected: boolean
  ) => {
    const nextSelectedCategorySlugs = new Set(validSelectedCategorySlugs);
    const nextSelectedSubcategorySlugs = new Set(validSelectedSubcategorySlugs);

    if (isSelected) {
      nextSelectedCategorySlugs.add(categorySlug);
      nextSelectedSubcategorySlugs.add(subcategorySlug);
    } else {
      nextSelectedSubcategorySlugs.delete(subcategorySlug);
    }

    onCategoryFiltersChange(
      facets.categories
        .filter((category) => nextSelectedCategorySlugs.has(category.slug))
        .map((category) => category.slug),
      [...nextSelectedSubcategorySlugs]
    );
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Kategorie</legend>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-app-text">Kategorie</span>
        {(validSelectedCategorySlugs.length > 0 || validSelectedSubcategorySlugs.length > 0) && (
          <ButtonCore
            text="Odznacz"
            onClick={clearFilters}
            className="shrink-0 whitespace-nowrap bg-transparent text-right text-xs text-app-textMuted hover:underline"
          />
        )}
      </div>
      <div className="-translate-x-1 flex flex-col gap-3">
        {facets.categories.map((category) => {
          const catalogCategory = catalogCategories.find(
            (catalogEntry) =>
              catalogEntry.slug === category.slug || catalogEntry.name === category.name
          );
          const isCategorySelected = validSelectedCategorySlugs.includes(category.slug);

          return (
            <div key={category.id} className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isCategorySelected}
                  onChange={(event) =>
                    handleCategoryChange(category.slug, event.currentTarget.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-app-surfaceStrong"
                />
                <span className="flex-1">{category.name}</span>
                <span className="text-app-textMuted">({category.productCount})</span>
              </label>

              {catalogCategory && catalogCategory.subcategories.length > 0 && (
                <div className="ml-6 flex flex-col gap-2">
                  {catalogCategory.subcategories.map((subcategory) => (
                    <label
                      key={subcategory.slug}
                      className="flex cursor-pointer items-start gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={validSelectedSubcategorySlugs.includes(subcategory.slug)}
                        onChange={(event) =>
                          handleSubcategoryChange(
                            category.slug,
                            subcategory.slug,
                            event.currentTarget.checked
                          )
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 accent-app-surfaceStrong"
                      />
                      <span className="flex-1">{subcategory.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
