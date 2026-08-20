import { Heart, LogIn, LogOut, Menu, Search, Server, ShoppingCart, User } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { healthCheck } from '../api/health.ts';
import headerLogo from '../assets/layout/logo_header.webp';
import headerLogoSmall from '../assets/layout/logo_header_small.webp';
import { useAuth } from '../features/auth/authContext.ts';
import { useCartStatus } from '../features/cart/cartStatusContext.ts';
import useCategories from '../features/category/useCategories.ts';
import { getCategorySearchPath } from '../features/search/categoryUtils.ts';
import { AUTH_ROUTES, getSectionHomeRoute, RENT_ROUTES } from '../routes.ts';
import ThemeSelector from './core/ThemeSelector.tsx';
import SearchBar from './SearchBar.tsx';
import SubsiteSelector from './SubsiteSelector.tsx';

const CATEGORY_GAP_PX = 24;

type HeaderProps = {
  showCategoryBar?: boolean;
};

export default function Header({ showCategoryBar = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { categories } = useCategories();
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(categories.length);
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);
  const categoryMeasureRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { status: authStatus, logout } = useAuth();
  const { hasItems: hasCartItems } = useCartStatus();
  const isAuthenticated = authStatus === 'authenticated';
  const sectionHomeRoute = getSectionHomeRoute(location.pathname);
  const isSectionHomePage =
    location.pathname === sectionHomeRoute || location.pathname === `${sectionHomeRoute}/`;

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
    if (!categoryBar || categories.length === 0) return;

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
  }, [showCategoryBar, categories]);

  const handleAuthAction = async () => {
    setIsMenuOpen(false);

    if (isAuthenticated) {
      navigate(RENT_ROUTES.home, { replace: true });
      await logout();
      return;
    }

    navigate(AUTH_ROUTES.login);
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

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isSectionHomePage) return;

    event.preventDefault();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full flex-col bg-app-surface">
      <div className="relative z-10 grid h-12 grid-cols-[auto_minmax(0,1fr)] items-center px-3 sm:px-6 md:px-12 lg:grid-cols-3">
        <div className="flex min-w-0 items-center gap-1 justify-self-start">
          <Link
            to={sectionHomeRoute}
            onClick={handleLogoClick}
            className="inline-flex w-fit shrink-0 items-center"
          >
            <span
              role="img"
              aria-label="Logo Polar Sport Rent"
              className="block h-10 w-[67px] bg-app-text sm:hidden"
              style={{
                WebkitMask: `url(${headerLogoSmall}) left center / contain no-repeat`,
                mask: `url(${headerLogoSmall}) left center / contain no-repeat`,
              }}
            />
            <span
              role="img"
              aria-label="Logo Polar Sport"
              className="hidden h-[41px] w-[205px] bg-app-text sm:block"
              style={{
                WebkitMask: `url(${headerLogo}) left center / contain no-repeat`,
                mask: `url(${headerLogo}) left center / contain no-repeat`,
              }}
            />
          </Link>
          <SubsiteSelector />
        </div>
        <div className="hidden min-w-0 lg:block">
          <SearchBar />
        </div>

        {isMobileSearchOpen && (
          <div className="min-w-0 lg:hidden">
            <SearchBar autoFocus showCloseButton onClose={() => setIsMobileSearchOpen(false)} />
          </div>
        )}

        <div
          className={`${isMobileSearchOpen ? 'hidden' : 'flex'} justify-self-end gap-3 text-app-text sm:gap-4 lg:flex`}
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
          <Link to={RENT_ROUTES.favorites}>
            <Heart className="cursor-pointer" />
          </Link>
          <Link
            to={RENT_ROUTES.cart}
            className="relative"
            aria-label={hasCartItems ? 'Koszyk zawiera produkty' : 'Koszyk'}
          >
            <ShoppingCart className="cursor-pointer" />
            {hasCartItems && (
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-app-danger ring-2 ring-app-surface" />
            )}
          </Link>
          <Link to={RENT_ROUTES.profile}>
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
                  {isAuthenticated ? <LogOut size={20} /> : <LogIn size={20} />}
                  <span>{isAuthenticated ? 'Wyloguj się' : 'Zaloguj się'}</span>
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
          className="relative hidden h-12 flex-row items-center justify-between gap-6 bg-app-surfaceStrong px-4 text-app-textInverted md:flex"
        >
          {categories.slice(0, visibleCategoryCount).map((category) => (
            <div key={category.slug} className="group relative shrink-0">
              <Link
                to={getCategorySearchPath(category.slug)}
                className="inline-flex h-12 items-center whitespace-nowrap hover:underline"
              >
                {category.name}
              </Link>
              {category.subcategories.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 min-w-44 pt-0 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-lg border border-app-border bg-app-surface py-1 text-app-text shadow-lg">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.slug}>
                        <span className="block cursor-default whitespace-nowrap px-4 py-2.5 text-sm hover:bg-app-surfaceSoft">
                          {subcategory.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div aria-hidden="true" className="invisible absolute whitespace-nowrap">
            {categories.map((category, index) => (
              <span
                key={category.slug}
                ref={(element) => {
                  categoryMeasureRefs.current[index] = element;
                }}
                className="inline-block"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
