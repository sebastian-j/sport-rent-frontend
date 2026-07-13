import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ComboBoxOption } from '../components/core/ComboBox.tsx';
import ContentPanel from '../components/core/ContentPanel.tsx';
import PageSelector from '../components/core/PageSelector.tsx';
import SortToggles, { type SortDirection } from '../components/core/SortToggles.tsx';

const TOTAL_PAGES = 10;
const SORT_OPTIONS: readonly ComboBoxOption[] = [
  { value: 'name', label: 'Nazwa' },
  { value: 'price', label: 'Cena' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  const pageFromParams = Number(searchParams.get('page'));
  const pageNumber =
    Number.isInteger(pageFromParams) && pageFromParams >= 1 && pageFromParams <= TOTAL_PAGES
      ? pageFromParams
      : 1;

  const handlePageChange = (nextPageNumber: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('page', String(nextPageNumber));
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-row gap-8 p-8">
      <ContentPanel className="w-52 flex-none">
        <p>Cena</p>
        <p>Slider</p>
        <p>Kategorie</p>
        <p>Checkboxy</p>
      </ContentPanel>
      <ContentPanel className="h-fit min-w-0 flex-1 flex-row justify-between self-start p-2">
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
          onPageChange={handlePageChange}
        />
      </ContentPanel>
    </div>
  );
}
