import { ImageOff, Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getProducts } from '../api/product.ts';
import type { ProductProps } from '../features/product/productProps.ts';
import { RENT_ROUTES } from '../routes.ts';
import { formatPrice } from '../utils/formatPrice.ts';
import { getErrorMessage } from '../utils/getErrorMessage.ts';
import { resolveImageUrls } from '../utils/resolveImageUrl.ts';

type SearchBarProps = {
  autoFocus?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
};

const SEARCH_DEBOUNCE_MS = 250;
const SEARCH_RESULTS_LIMIT = 5;
const DEFAULT_SEARCH_ERROR = 'Nie udało się pobrać produktów';

export default function SearchBar({
  autoFocus = false,
  onClose,
  showCloseButton = false,
}: SearchBarProps) {
  const location = useLocation();
  const queryFromUrl = new URLSearchParams(location.search).get('query') ?? '';
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const searchQuery = searchValue.trim();

  useEffect(() => {
    if (!isOpen || !searchQuery) {
      setProducts([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let ignoreResponse = false;
    setIsLoading(true);
    setError(null);

    const timeout = window.setTimeout(() => {
      void getProducts({
        query: searchQuery,
        page: 1,
        pageSize: SEARCH_RESULTS_LIMIT,
      })
        .then(({ data, error: requestError }) => {
          if (ignoreResponse) return;

          if (requestError || !data) {
            setProducts([]);
            setError(getErrorMessage(requestError, DEFAULT_SEARCH_ERROR));
            return;
          }

          setProducts(
            data.map((product) => ({
              id: product.id,
              name: product.name,
              description: product.description ?? '',
              price: product.price ?? 0,
              slug: product.slug,
              images: resolveImageUrls(product.images),
              imageAlts: product.imageAlts,
              category: product.category ?? '',
            }))
          );
        })
        .catch(() => {
          if (!ignoreResponse) {
            setProducts([]);
            setError(DEFAULT_SEARCH_ERROR);
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
    const searchParams = new URLSearchParams({
      page: '1',
      sort: 'name',
      order: 'asc',
    });

    if (query) {
      searchParams.set('query', query);
    }

    navigate(`${RENT_ROUTES.search}?${searchParams.toString()}`);
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
          aria-controls={isOpen ? 'product-search-results' : undefined}
          role="combobox"
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
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-app-border bg-app-surface p-2 shadow-lg"
        >
          {isLoading ? (
            <p className="p-3 text-center text-app-textMuted">Ładowanie produktów...</p>
          ) : error ? (
            <p className="p-3 text-center text-app-danger">{error}</p>
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
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.imageAlts?.[0]}
                        className="h-16 w-20 shrink-0 rounded-md object-contain"
                      />
                    ) : (
                      <div
                        role="img"
                        aria-label={`Brak zdjęcia produktu ${product.name}`}
                        className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md bg-app-surfaceSoft text-app-textMuted"
                      >
                        <ImageOff aria-hidden="true" />
                      </div>
                    )}
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
