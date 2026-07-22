import headerLogo from '../assets/logo_header.png';
import headerLogoSmall from '../assets/logo_header_small.png';
import { Heart, LogIn, LogOut, Menu, Search, Server, ShoppingCart, User } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { healthCheck } from '../api/health.ts';
import SearchBar from './SearchBar.tsx';
import { getCategorySearchPath, toCategorySlug } from '../features/search/categoryUtils.ts';
import ThemeSelector from './core/ThemeSelector.tsx';

const CATEGORIES = [
  'Rowery i akcesoria',
  'Przyczepki rowerowe',
  'Namioty osobowe',
  'Sprzęt wodny',
  'Via ferraty i wspinanie',
  'Nosidełka turystyczne',
  'Namioty',
];

const CATEGORY_GAP_PX = 24;

type HeaderProps = {
  showCategoryBar?: boolean;
};

export default function Header({ showCategoryBar = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(CATEGORIES.length);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const navigate = useNavigate();
  const hasAccessToken = Boolean(localStorage.getItem('accessToken'));

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeMenuOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', closeMenuOnOutsideClick);
    document.addEventListener('keydown', closeMenuOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeMenuOnOutsideClick);
      document.removeEventListener('keydown', closeMenuOnEscape);
    };
  }, [isMenuOpen]);

  useLayoutEffect(() => {
    const categoryBar = categoryBarRef.current;
    if (!categoryBar) return;

    const updateVisibleCategoryCount = () => {
      const styles = getComputedStyle(categoryBar);
      const availableWidth =
        categoryBar.clientWidth -
        Number.parseFloat(styles.paddingLeft) -
        Number.parseFloat(styles.paddingRight);
      let occupiedWidth = 0;
      let nextVisibleCount = 0;

      for (const category of categoryMeasureRefs.current) {
        if (!category) continue;

        const categoryWidth = category.getBoundingClientRect().width;
        const nextOccupiedWidth =
          occupiedWidth + categoryWidth + (nextVisibleCount > 0 ? CATEGORY_GAP_PX : 0);

        if (nextOccupiedWidth > availableWidth && nextVisibleCount > 0) break;

        occupiedWidth = nextOccupiedWidth;
        nextVisibleCount += 1;
      }

      setVisibleCategoryCount(nextVisibleCount);
    };

    updateVisibleCategoryCount();

    const resizeObserver = new ResizeObserver(updateVisibleCategoryCount);
    resizeObserver.observe(categoryBar);
    categoryMeasureRefs.current.forEach((category) => {
      if (category) resizeObserver.observe(category);
    });

    return () => resizeObserver.disconnect();
  }, [showCategoryBar]);

  const handleAuthAction = () => {
    setIsMenuOpen(false);

    if (hasAccessToken) {
      localStorage.removeItem('accessToken');
      navigate('/', { replace: true });
      return;
    }

    navigate('/login');
  };

  const handleHealthCheck = async () => {
    try {
      const result = await healthCheck();

      if (!result.response.ok) {
        alert(`Serwer zwrócił błąd HTTP ${result.response.status}.`);
        return;
      }

      alert(JSON.stringify(result.data, null, 2));
    } catch {
      alert('Nie udało się połączyć z serwerem.');
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full flex-col bg-app-surface">
      <div className="relative z-10 grid h-12 grid-cols-[auto_minmax(0,1fr)] items-center px-4 sm:px-6 md:px-12 lg:grid-cols-3">
        <Link to="/" className="inline-flex w-fit items-center justify-self-start pe-4">
          <span
            role="img"
            aria-label="Logo Polar Sport Rent"
            className="block h-10 w-[67px] bg-app-text sm:hidden"
            style={{
              WebkitMask: `url(${headerLogoSmall}) center / contain no-repeat`,
              mask: `url(${headerLogoSmall}) center / contain no-repeat`,
            }}
          />
          <span
            role="img"
            aria-label="Logo Polar Sport Rent"
            className="hidden h-[41px] w-64 bg-app-text sm:block"
            style={{
              WebkitMask: `url(${headerLogo}) center / contain no-repeat`,
              mask: `url(${headerLogo}) center / contain no-repeat`,
            }}
          />
        </Link>
        <div className="hidden min-w-0 lg:block">
          <SearchBar />
        </div>

        {isMobileSearchOpen && (
          <div className="min-w-0 lg:hidden">
            <SearchBar autoFocus showCloseButton onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        <div
          className={`${isMobileSearchOpen ? 'hidden' : 'flex'} justify-self-end gap-4 text-app-text lg:flex`}
        >
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsMobileSearchOpen(true);
            }}
            aria-label="Otwórz wyszukiwarkę"
            className="rounded lg:hidden"
          >
            <Search />
          </button>
          <Link to="/favorites">
            <Heart className="cursor-pointer" />
          </Link>
          <Link to="/cart">
            <ShoppingCart className="cursor-pointer" />
          </Link>
          <Link to="/profile">
            <User className="cursor-pointer" />
          </Link>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((previous) => !previous)}
              aria-label="Otwórz menu użytkownika"
              aria-expanded={isMenuOpen}
              aria-controls="user-menu"
              className="block rounded-lg"
            >
              <Menu />
            </button>

            {isMenuOpen && (
              <div
                id="user-menu"
                className="absolute right-0 top-full mt-2 w-max rounded-lg border border-app-border bg-app-surface p-2 shadow-lg"
              >
                <button
                  type="button"
                  onClick={handleHealthCheck}
                  className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg p-3 text-left hover:bg-app-surfaceSoft"
                >
                  <Server size={20} />
                  <span>Sprawdź połączenie</span>
                </button>
                <button
                  type="button"
                  onClick={handleAuthAction}
                  className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg p-3 text-left hover:bg-app-surfaceSoft"
                >
                  {hasAccessToken ? <LogOut size={20} /> : <LogIn size={20} />}
                  <span>{hasAccessToken ? 'Wyloguj się' : 'Zaloguj się'}</span>
                </button>
                <ThemeSelector />
              </div>
            )}
          </div>
        </div>
      </div>

      {showCategoryBar && (
        <div
          ref={categoryBarRef}
          className="relative hidden h-12 flex-row items-center justify-between gap-6 overflow-hidden bg-app-surfaceStrong px-4 text-app-textInverted md:flex"
        >
          {CATEGORIES.slice(0, visibleCategoryCount).map((item) => (
            <Link
              key={item}
              to={getCategorySearchPath(toCategorySlug(item))}
              className="shrink-0 whitespace-nowrap hover:underline"
            >
              {item}
            </Link>
          ))}
          <div aria-hidden="true" className="invisible absolute whitespace-nowrap">
            {CATEGORIES.map((item, index) => (
              <span
                key={item}
                ref={(element) => {
                  categoryMeasureRefs.current[index] = element;
                }}
                className="inline-block"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
