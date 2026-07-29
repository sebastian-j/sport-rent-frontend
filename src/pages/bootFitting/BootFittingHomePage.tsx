/*
 * Źródło treści:
 * https://psstrefaoutdoor.pl/krakow/bootfitting-krakow/
 */

import {
  AlignVerticalJustifyCenter,
  Flame,
  Footprints,
  Mail,
  MapPin,
  MoveHorizontal,
  Phone,
  ScanSearch,
  SlidersHorizontal,
  UserRoundCheck,
} from 'lucide-react';

import { scrollToSection } from '../../utils/scrollToSection.ts';

const FITTING_AREAS = [
  {
    title: 'Punkty ucisku',
    description:
      'Odbarczenie wybranego punktu lub strefy pomaga dopasować but do indywidualnego kształtu stopy.',
    icon: MoveHorizontal,
  },
  {
    title: 'Objętość botka',
    description:
      'Miejscowe zwiększenie albo zmniejszenie objętości poprawia trzymanie stopy wewnątrz buta.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Ustawienie cholewki',
    description:
      'Canting pozwala skorygować boczne ustawienie cholewki względem naturalnej pozycji nogi.',
    icon: AlignVerticalJustifyCenter,
  },
  {
    title: 'Formowanie termiczne',
    description:
      'Wygrzewanie buta wewnętrznego umożliwia dopasowanie botka do anatomii użytkownika.',
    icon: Flame,
  },
];

const BOOT_FITTING_PRICES = [
  { name: 'Konsultacja z bootfitterem', price: '60 zł' },
  { name: 'Canting', price: '50 zł' },
  { name: 'Wygrzewanie butów wewnętrznych', price: '100 zł' },
  { name: 'Odbarczenie punktu lub strefy', price: '60 zł' },
  { name: 'Zmniejszenie objętości botka — punkt', price: '50 zł' },
  { name: 'Zwiększenie objętości botka — strefa', price: '50 zł' },
];

const VISIT_STEPS = [
  {
    title: 'Konsultacja',
    description:
      'Opowiedz o swoim sprzęcie, stylu jazdy i miejscach, w których odczuwasz dyskomfort.',
    icon: UserRoundCheck,
  },
  {
    title: 'Ocena dopasowania',
    description: 'Bootfitter sprawdzi ułożenie stopy, objętość buta i ustawienie cholewki.',
    icon: ScanSearch,
  },
  {
    title: 'Dopasowanie buta',
    description: 'Zakres modyfikacji zostanie dobrany do konkretnego problemu i konstrukcji buta.',
    icon: Footprints,
  },
];

export default function BootFittingHomePage() {
  return (
    <article>
      <header>
        <p className="mb-3 font-bold uppercase tracking-[0.08em] text-app-textMuted">
          Polar Sport Boot-Fitting
        </p>
        <h1>Profesjonalny boot-fitting w Krakowie</h1>
        <p>
          Dopasujemy buty narciarskie do kształtu Twoich stóp i naturalnego ustawienia nóg, aby
          poprawić trzymanie stopy oraz ograniczyć dyskomfort podczas jazdy.
        </p>
      </header>

      <section>
        <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
          <a
            href="#zakres-dopasowania"
            onClick={(event) => scrollToSection(event, 'zakres-dopasowania')}
            className="rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted !no-underline sm:p-8"
          >
            <Footprints className="mb-5 h-11 w-11" aria-hidden="true" />
            <h2 className="text-app-textInverted">But dopasowany do Ciebie</h2>
            <p className="mt-3 text-app-textInvertedMuted">
              Pracujemy nad botkiem, objętością skorupy i ustawieniem cholewki.
            </p>
            <span className="mt-5 inline-block font-semibold">Poznaj możliwości ↓</span>
          </a>

          <a
            href="#cennik"
            onClick={(event) => scrollToSection(event, 'cennik')}
            className="rounded-2xl bg-app-surfaceSoft p-6 text-app-textStrong !no-underline sm:p-8"
          >
            <ScanSearch className="mb-5 h-11 w-11" aria-hidden="true" />
            <h2>Konsultacja od 60 zł</h2>
            <p className="mt-3 text-app-textMuted">
              Zacznij od rozmowy z bootfitterem i oceny aktualnego dopasowania.
            </p>
            <span className="mt-5 inline-block font-semibold">Zobacz cennik ↓</span>
          </a>
        </div>
      </section>

      <section id="zakres-dopasowania" className="scroll-mt-20">
        <div className="flex items-center gap-4">
          <Footprints className="h-9 w-9 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">
              Zakres usług
            </p>
            <h2>Dopasowanie botka, skorupy i cholewki</h2>
          </div>
        </div>
        <p>
          Każda stopa i każdy but są inne. Dlatego zakres prac dobieramy po konsultacji oraz
          sprawdzeniu, gdzie but jest zbyt ciasny, zbyt luźny albo nie układa się prawidłowo.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {FITTING_AREAS.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-xl bg-app-surfaceSoft p-5 sm:p-6">
              <Icon className="mb-4 h-7 w-7" aria-hidden="true" />
              <h3>{title}</h3>
              <p className="mt-2 text-sm leading-6 text-app-textMuted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div>
          <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">
            Przebieg wizyty
          </p>
          <h2>Od konsultacji do gotowego dopasowania</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {VISIT_STEPS.map(({ title, description, icon: Icon }, index) => (
            <div
              key={title}
              className="relative rounded-xl border border-app-borderSoft p-5 pt-12 sm:p-6 sm:pt-12"
            >
              <span className="absolute left-5 top-4 text-sm font-black text-app-textMuted">
                0{index + 1}
              </span>
              <Icon className="mb-4 h-8 w-8" aria-hidden="true" />
              <h3>{title}</h3>
              <p className="mt-2 text-sm leading-6 text-app-textMuted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="cennik" className="scroll-mt-20">
        <div>
          <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">Cennik</p>
          <h2>Najczęściej wybierane usługi</h2>
          <p className="mt-3 text-app-textMuted">
            Ostateczny zakres prac ustalamy po obejrzeniu butów i konsultacji z bootfitterem.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-app-borderSoft md:grid-cols-2">
          {BOOT_FITTING_PRICES.map(({ name, price }, index) => (
            <div
              key={name}
              className={`flex items-center justify-between gap-4 p-5 ${
                index % 2 === 0 ? 'bg-app-surfaceSoft/70' : 'bg-app-surface'
              }`}
            >
              <span className="font-medium text-app-textStrong">{name}</span>
              <span className="shrink-0 font-bold">{price}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-8 rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-app-textInverted">Umów konsultację</h2>
            <p className="mt-3 text-app-textInvertedMuted">
              Boot-fitting wykonujemy w Polar Sport Strefa Outdoor przy ul. Kałuży 1 w Krakowie.
            </p>
          </div>

          <div className="grid gap-3 text-sm sm:text-base">
            <a
              href="tel:+48570440636"
              className="inline-flex items-center gap-3 text-app-textInverted"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              +48 570 440 636
            </a>
            <a
              href="mailto:kontakt@psstrefaoutdoor.pl"
              className="inline-flex items-center gap-3 text-app-textInverted"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              kontakt@psstrefaoutdoor.pl
            </a>
            <span className="inline-flex items-center gap-3 text-app-textInverted">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              ul. Kałuży 1, 30-111 Kraków
            </span>
          </div>
        </div>
      </section>
    </article>
  );
}
