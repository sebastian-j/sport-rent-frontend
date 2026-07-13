import { useSearchParams } from 'react-router-dom';
import ContentPanel from '../components/core/ContentPanel.tsx';
import PageSelector from '../components/core/PageSelector.tsx';

const TOTAL_PAGES = 10;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
      <ContentPanel className="min-w-0 flex-1">
        <PageSelector
          pageNumber={pageNumber}
          totalPages={TOTAL_PAGES}
          onPageChange={handlePageChange}
        />
      </ContentPanel>
    </div>
  );
}
