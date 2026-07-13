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
  selectedCategorySlugs: readonly string[];
  onSelectedCategorySlugsChange: (categorySlugs: readonly string[]) => void;
};

export default function CategoryFilter({
  facets,
  selectedCategorySlugs,
  onSelectedCategorySlugsChange,
}: CategoryFilterProps) {
  const availableCategorySlugs = new Set(
    facets.categories
      .filter((category) => category.productCount > 0)
      .map((category) => category.slug)
  );
  const validSelectedCategorySlugs = selectedCategorySlugs.filter((categorySlug) =>
    availableCategorySlugs.has(categorySlug)
  );

  const handleCategoryChange = (categorySlug: string, isSelected: boolean) => {
    const nextSelectedCategorySlugs = new Set(validSelectedCategorySlugs);

    if (isSelected) {
      nextSelectedCategorySlugs.add(categorySlug);
    } else {
      nextSelectedCategorySlugs.delete(categorySlug);
    }

    onSelectedCategorySlugsChange(
      facets.categories
        .filter((category) => nextSelectedCategorySlugs.has(category.slug))
        .map((category) => category.slug)
    );
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Kategorie</legend>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-app-text">Kategorie</span>
        {validSelectedCategorySlugs.length > 0 && (
          <ButtonCore
            text="Odznacz"
            onClick={() => onSelectedCategorySlugsChange([])}
            className="shrink-0 whitespace-nowrap bg-transparent text-right text-xs text-app-textMuted hover:underline"
          />
        )}
      </div>
      <div className="-translate-x-1 flex flex-col gap-3">
        {facets.categories.map((category) => (
          <label
            key={category.id}
            className={`flex items-start gap-2 text-sm ${
              category.productCount === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              disabled={category.productCount === 0}
              checked={validSelectedCategorySlugs.includes(category.slug)}
              onChange={(event) => handleCategoryChange(category.slug, event.currentTarget.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-app-surfaceStrong"
            />
            <span className="flex-1">{category.name}</span>
            <span className="text-app-textMuted">({category.productCount})</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
