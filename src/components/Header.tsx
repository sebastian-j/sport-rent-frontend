import headerLogo from '../assets/logo_header.png';
import { Heart, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

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
    <header className="w-full flex flex-col fixed bg-white z-50">
      <div className="grid h-12 grid-cols-3 items-center px-12">
        <img src={headerLogo} alt="Logo" className="w-64 max-w-full h-auto justify-self-start" />
        <div className="flex items-center justify-self-center rounded-lg bg-neutral-200 px-2 min-w-0 w-full">
          <Search />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Szukaj..."
            className="rounded-lg w-full bg-neutral-200 p-2 outline-none"
          />
        </div>

        <div className="flex justify-self-end gap-4">
          <Heart />
          <ShoppingCart />
          <User />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between bg-blue-900 text-white h-12 px-8">
        {CATEGORIES.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </header>
  );
}
