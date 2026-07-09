import headerLogo from '../assets/logo_header.png';
import headerLogoSmall from '../assets/logo_header_small.png';
import { Heart, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'Rowery i akcesoria',
  'Przyczepki rowerowe',
  'Namioty osobowe',
  'Sprzęt wodny',
  'Via ferraty i wspinanie',
  'Nosidełka turystyczne',
  'Namioty',
];

export default function Header() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <header className="fixed z-50 flex w-full flex-col bg-app-surface">
      <div className="grid h-12 grid-cols-3 items-center px-12">
        <Link to="/" className="inline-flex w-fit items-center justify-self-start pe-4">
          <picture>
            <source media="(max-width: 960px)" srcSet={headerLogoSmall} />

            <img
              src={headerLogo}
              alt="Logo"
              className="block h-10 w-auto min-[961px]:h-auto min-[961px]:w-64"
            />
          </picture>
        </Link>
        <div className="flex min-w-0 w-full items-center justify-self-center rounded-lg bg-app-surfaceSoft px-2 text-app-text">
          <Search className="text-app-textMuted" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Szukaj..."
            className="w-full select-none rounded-lg bg-app-surfaceSoft p-2 text-app-text outline-none placeholder:text-app-textMuted"
          />
        </div>

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
        </div>
      </div>

      <div className="flex h-12 flex-row items-center justify-between bg-app-surfaceStrong px-8 text-app-textInverted">
        {CATEGORIES.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </header>
  );
}
