import { Search } from 'lucide-react';
import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../assets/products/products.ts';
import { formatPrice } from '../utils/formatPrice.ts';

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const normalizedSearchValue = searchValue.trim().toLocaleLowerCase();
  const matchingProducts = normalizedSearchValue
    ? PRODUCTS.filter((product) => product.name.toLocaleLowerCase().includes(normalizedSearchValue))
    : [];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchValue.trim();
    if (!query) return;

    navigate(`/search?${new URLSearchParams({ q: query }).toString()}`);
    setIsOpen(false);
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
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Szukaj..."
          aria-label="Wyszukaj produkt po nazwie"
          aria-expanded={isOpen && Boolean(normalizedSearchValue)}
          aria-controls="product-search-results"
          className="w-full select-none rounded-lg bg-app-surfaceSoft p-2 text-app-text outline-none placeholder:text-app-textMuted"
        />
      </form>

      {isOpen && normalizedSearchValue && (
        <div
          id="product-search-results"
          className="absolute left-0 right-0 top-full mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-app-border bg-app-surface p-2 shadow-lg"
        >
          {matchingProducts.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {matchingProducts.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => {
                      setSearchValue('');
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-app-surfaceSoft"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.alt}
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
