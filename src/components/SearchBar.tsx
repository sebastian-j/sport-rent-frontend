import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getProducts } from '../api/product.ts';
import type { ProductProps } from '../features/product/productProps.ts';
import { RENT_ROUTES } from '../routes.ts';
import { formatPrice } from '../utils/formatPrice.ts';

type SearchBarProps = {
  autoFocus?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
};

const SEARCH_DEBOUNCE_MS = 250;
const SEARCH_RESULTS_LIMIT = 5;

export default function SearchBar({
  autoFocus = false,
  onClose,
  showCloseButton = false,
}: SearchBarProps) {
  const location = useLocation();
  const queryFromUrl = new URLSearchParams(location.search).get('q') ?? '';
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const searchQuery = searchValue.trim();

  useEffect(() => {
    if (!isOpen || !searchQuery) {
      setProducts([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let ignoreResponse = false;
    setIsLoading(true);
    setHasError(false);

    const timeout = window.setTimeout(() => {
      void getProducts({
        q: searchQuery,
        page: 1,
        pageSize: SEARCH_RESULTS_LIMIT,
      })
        .then(({ data, error }) => {
          if (ignoreResponse) return;

          if (error || !data) {
            setProducts([]);
            setHasError(true);
            return;
          }

          setProducts(
            data.map((product) => ({
              id: product.id,
              name: product.name,
              description: product.description ?? '',
              price: product.price ?? 0,
              slug: product.slug,
              images: product.images ?? [],
              imageAlts: product.imageAlts,
              category: product.category ?? '',
            }))
          );
        })
        .catch(() => {
          if (!ignoreResponse) {
            setProducts([]);
            setHasError(true);
          }
        })
        .finally(() => {
          if (!ignoreResponse) setIsLoading(false);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      ignoreResponse = true;
      window.clearTimeout(timeout);
    };
  }, [isOpen, searchQuery]);

  useEffect(() => {
    setSearchValue(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchValue.trim();
    if (!query) return;

    navigate(
      `${RENT_ROUTES.search}?${new URLSearchParams({
        q: query,
        page: '1',
        sort: 'name',
        order: 'asc',
      }).toString()}`
    );
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div ref={searchRef} className="relative min-w-0 w-full justify-self-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center rounded-lg bg-app-surfaceSoft px-2 text-app-text"
      >
        <button
          type="submit"
          aria-label="Szukaj"
          className="shrink-0 rounded text-app-textMuted hover:text-app-text"
        >
          <Search />
        </button>
        <input
          type="search"
          autoFocus={autoFocus}
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Szukaj..."
          aria-label="Wyszukaj produkt po nazwie"
          aria-expanded={isOpen && Boolean(searchQuery)}
          aria-controls="product-search-results"
          className="w-full select-none rounded-lg bg-app-surfaceSoft p-2 text-app-text outline-none placeholder:text-app-textMuted"
        />
        {showCloseButton && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            aria-label="Zamknij wyszukiwarkę"
            className="shrink-0 rounded text-app-textMuted hover:text-app-text"
          >
            <X />
          </button>
        )}
      </form>

      {isOpen && searchQuery && (
        <div
          id="product-search-results"
          aria-busy={isLoading}
          aria-live="polite"
          className="absolute left-0 right-0 top-full mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-app-border bg-app-surface p-2 shadow-lg"
        >
          {isLoading ? (
            <p className="p-3 text-center text-app-textMuted">Ładowanie produktów...</p>
          ) : hasError ? (
            <p className="p-3 text-center text-app-danger">Nie udało się pobrać produktów</p>
          ) : products.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    to={RENT_ROUTES.product(product.slug)}
                    onClick={() => {
                      setSearchValue('');
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-app-surfaceSoft"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.imageAlts?.[0]}
                      className="h-16 w-20 shrink-0 rounded-md object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-app-text">{product.name}</p>
                      <p className="text-sm text-app-textMuted">
                        {formatPrice(product.price)} / doba
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-center text-app-textMuted">Nie znaleziono produktów</p>
          )}
        </div>
      )}
    </div>
  );
}
