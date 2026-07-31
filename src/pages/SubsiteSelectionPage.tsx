import { ArrowRight, Bike, Footprints, Wrench, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import headerLogo from '../assets/layout/logo_header.webp';
import { BOOT_FITTING_ROUTES, RENT_ROUTES, ROOT_ROUTE, SERVICE_ROUTES } from '../routes.ts';

type SubsiteCard = {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
};

const SUBSITE_CARDS: SubsiteCard[] = [
  {
    title: 'RENT',
    description: 'Wypożycz sprzęt outdoorowy i przygotuj się na kolejną przygodę.',
    path: RENT_ROUTES.home,
    icon: Bike,
  },
  {
    title: 'SERVICE',
    description: 'Skorzystaj z profesjonalnego serwisu i zadbaj o swój sprzęt.',
    path: SERVICE_ROUTES.home,
    icon: Wrench,
  },
  {
    title: 'BOOT-FITTING',
    description: 'Dopasuj buty do swoich stóp, stylu jazdy i indywidualnych potrzeb.',
    path: BOOT_FITTING_ROUTES.home,
    icon: Footprints,
  },
];

export default function SubsiteSelectionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-app-surface px-4 py-8 text-app-text sm:px-6 md:py-12">
      <section
        aria-labelledby="subsite-selection-title"
        className="w-full max-w-4xl rounded-3xl border border-app-borderSoft bg-app-surfaceElevated p-5 shadow-2xl shadow-app-textStrong/10 sm:p-8 md:p-10"
      >
        <div className="mb-7 flex flex-col items-center text-center md:mb-9">
          <Link to={ROOT_ROUTE} aria-label="Strona główna Polar Sport">
            <span
              role="img"
              aria-label="Logo Polar Sport"
              className="block h-[49px] w-[245px] max-w-full bg-app-text sm:h-[57px] sm:w-[285px]"
              style={{
                WebkitMask: `url(${headerLogo}) center / contain no-repeat`,
                mask: `url(${headerLogo}) center / contain no-repeat`,
              }}
            />
          </Link>
          <h1
            id="subsite-selection-title"
            className="mt-5 text-xl font-bold text-app-textStrong sm:text-2xl"
          >
            Wybierz interesującą Cię sekcję
          </h1>
        </div>

        <nav
          aria-label="Sekcje Polar Sport"
          className="grid grid-cols-2 gap-3 sm:gap-4 md:flex md:flex-col"
        >
          {SUBSITE_CARDS.map(({ title, description, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="group relative flex aspect-square min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border border-app-borderSoft bg-app-surface p-2 text-center transition duration-200 hover:-translate-y-0.5 hover:border-app-border hover:bg-app-surfaceSoft hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-border md:aspect-auto md:min-h-28 md:flex-row md:justify-start md:gap-6 md:p-5 md:text-left"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-app-surfaceStrong text-app-textInverted md:h-[4.5rem] md:w-[4.5rem]">
                <Icon aria-hidden="true" className="h-8 w-8 md:h-9 md:w-9" strokeWidth={1.8} />
              </span>

              <span className="min-w-0 md:flex-1">
                <span className="block break-words text-xs font-black tracking-[0.06em] text-app-textStrong sm:text-base md:text-xl">
                  {title}
                </span>
                <span className="mt-1 hidden text-sm leading-relaxed text-app-textMuted md:block">
                  {description}
                </span>
              </span>

              <ArrowRight
                aria-hidden="true"
                className="hidden shrink-0 text-app-textMuted transition-transform group-hover:translate-x-1 md:block"
              />
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
