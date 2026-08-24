import type { ManufacturerItem } from '../../api/manufacturer.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';

type ManufacturerFilterProps = {
  manufacturers: readonly ManufacturerItem[];
  selectedManufacturerSlugs: readonly string[];
  onManufacturerFiltersChange: (manufacturerSlugs: readonly string[]) => void;
};

export default function ManufacturerFilter({
  manufacturers,
  selectedManufacturerSlugs,
  onManufacturerFiltersChange,
}: ManufacturerFilterProps) {
  const availableManufacturerSlugs = new Set(
    manufacturers.map((manufacturer) => manufacturer.slug)
  );
  const validSelectedManufacturerSlugs = selectedManufacturerSlugs.filter((manufacturerSlug) =>
    availableManufacturerSlugs.has(manufacturerSlug)
  );

  const clearFilters = () => onManufacturerFiltersChange([]);

  const handleManufacturerChange = (manufacturerSlug: string, isSelected: boolean) => {
    const nextSelectedManufacturerSlugs = new Set(validSelectedManufacturerSlugs);

    if (isSelected) {
      nextSelectedManufacturerSlugs.add(manufacturerSlug);
    } else {
      nextSelectedManufacturerSlugs.delete(manufacturerSlug);
    }

    onManufacturerFiltersChange(
      manufacturers
        .filter((manufacturer) => nextSelectedManufacturerSlugs.has(manufacturer.slug))
        .map((manufacturer) => manufacturer.slug)
    );
  };

  if (manufacturers.length === 0) return null;

  return (
    <fieldset className="w-full">
      <legend className="sr-only">Producenci</legend>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-app-text">Producenci</span>
        {validSelectedManufacturerSlugs.length > 0 && (
          <ButtonCore
            text="Odznacz"
            onClick={clearFilters}
            className="shrink-0 whitespace-nowrap bg-transparent text-right text-xs text-app-textMuted hover:underline"
          />
        )}
      </div>
      <div className="-translate-x-1 flex flex-col gap-3">
        {manufacturers.map((manufacturer) => (
          <label key={manufacturer.slug} className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={validSelectedManufacturerSlugs.includes(manufacturer.slug)}
              onChange={(event) =>
                handleManufacturerChange(manufacturer.slug, event.currentTarget.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-app-surfaceStrong"
            />
            <span className="flex-1">{manufacturer.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
