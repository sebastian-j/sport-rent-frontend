import { useSearchParams } from 'react-router-dom';
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
};

export default function CategoryFilter({ facets }: CategoryFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const availableCategorySlugs = new Set(
    facets.categories
      .filter((category) => category.productCount > 0)
      .map((category) => category.slug)
  );
  const selectedCategorySlugs = searchParams
    .getAll('category')
    .filter((categorySlug) => availableCategorySlugs.has(categorySlug));

  const handleCategoryChange = (categorySlug: string, isSelected: boolean) => {
    const nextSelectedCategorySlugs = new Set(selectedCategorySlugs);

    if (isSelected) {
      nextSelectedCategorySlugs.add(categorySlug);
    } else {
      nextSelectedCategorySlugs.delete(categorySlug);
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('category');
    facets.categories
      .filter((category) => nextSelectedCategorySlugs.has(category.slug))
      .forEach((category) => nextSearchParams.append('category', category.slug));
    nextSearchParams.set('page', '1');
    setSearchParams(nextSearchParams);
  };

  const handleClearCategories = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete('category');
    nextSearchParams.set('page', '1');
    setSearchParams(nextSearchParams);
  };

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Kategorie</legend>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-app-text">Kategorie</span>
        {selectedCategorySlugs.length > 0 && (
          <ButtonCore
            text="Odznacz"
            onClick={handleClearCategories}
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
              checked={selectedCategorySlugs.includes(category.slug)}
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
