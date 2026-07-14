import headerLogo from '../assets/logo_header.png';
import headerLogoSmall from '../assets/logo_header_small.png';
import { Heart, LogIn, LogOut, Menu, ShoppingCart, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

type HeaderProps = {
  showCategoryBar?: boolean;
};

export default function Header({ showCategoryBar = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const handleAuthAction = () => {
    setIsMenuOpen(false);

    if (hasAccessToken) {
      localStorage.removeItem('accessToken');
      navigate('/', { replace: true });
      return;
    }

    navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full flex-col bg-app-surface">
      <div className="grid h-12 grid-cols-3 items-center px-12">
        <Link to="/" className="inline-flex w-fit items-center justify-self-start pe-4">
          <span
            role="img"
            aria-label="Logo Polar Sport Rent"
            className="block h-10 w-[67px] bg-app-text min-[961px]:hidden"
            style={{
              WebkitMask: `url(${headerLogoSmall}) center / contain no-repeat`,
              mask: `url(${headerLogoSmall}) center / contain no-repeat`,
            }}
          />
          <span
            role="img"
            aria-label="Logo Polar Sport Rent"
            className="hidden h-[41px] w-64 bg-app-text min-[961px]:block"
            style={{
              WebkitMask: `url(${headerLogo}) center / contain no-repeat`,
              mask: `url(${headerLogo}) center / contain no-repeat`,
            }}
          />
        </Link>
        <SearchBar />

        <div className="flex justify-self-end gap-4 text-app-text">
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
          <div className="flex h-12 flex-row items-center justify-between bg-app-surfaceStrong px-8 text-app-textInverted">
            {CATEGORIES.map((item) => (
                <Link
                    key={item}
                    to={getCategorySearchPath(toCategorySlug(item))}
                    className="hover:underline"
                >
                  {item}
                </Link>
            ))}
          </div>
      )}

    </header>
  );
}
