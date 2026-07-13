import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ButtonCore from './ButtonCore.tsx';

type PageSelectorProps = {
  pageNumber: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
};

export default function PageSelector({ pageNumber, totalPages, onPageChange }: PageSelectorProps) {
  const lastPage = Math.max(1, totalPages);
  const isFirstPage = pageNumber <= 1;
  const isLastPage = pageNumber >= lastPage;
  const [inputValue, setInputValue] = useState(String(pageNumber));

  useEffect(() => {
    setInputValue(String(pageNumber));
  }, [pageNumber]);

  const commitPageNumber = () => {
    const parsedPageNumber = Number(inputValue);

    if (!Number.isInteger(parsedPageNumber)) {
      setInputValue(String(pageNumber));
      return;
    }

    const nextPageNumber = Math.min(lastPage, Math.max(1, parsedPageNumber));
    setInputValue(String(nextPageNumber));

    if (nextPageNumber !== pageNumber) {
      onPageChange(nextPageNumber);
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <ButtonCore
        onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
        disabled={isFirstPage}
        ariaLabel="Poprzednia strona"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-surfaceStrong disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="text-white" />
      </ButtonCore>

      <input
        type="number"
        min={1}
        max={lastPage}
        step={1}
        inputMode="numeric"
        value={inputValue}
        onChange={(event) => setInputValue(event.currentTarget.value)}
        onBlur={commitPageNumber}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }

          if (event.key === 'Escape') {
            setInputValue(String(pageNumber));
            event.currentTarget.blur();
          }
        }}
        aria-label="Numer strony"
        className="h-10 w-[60px] shrink-0 rounded-xl bg-app-surface text-center outline-none"
      />

      <ButtonCore
        onClick={() => onPageChange(Math.min(lastPage, pageNumber + 1))}
        disabled={isLastPage}
        ariaLabel="Następna strona"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-surfaceStrong disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowRight className="text-white" />
      </ButtonCore>
    </div>
  );
}
