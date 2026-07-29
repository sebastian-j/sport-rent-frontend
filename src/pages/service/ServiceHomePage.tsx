/*
 * Źródła treści:
 * https://psstrefaoutdoor.pl/krakow/serwisy/serwis-rowerowy-krakow/
 * https://psstrefaoutdoor.pl/
 */

import {
  Bike,
  ChevronDown,
  CircleDot,
  Clock,
  Disc3,
  Gauge,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Settings,
  Snowflake,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { useId, useState } from 'react';

import { scrollToSection } from '../../utils/scrollToSection.ts';

type PriceItem = {
  name: string;
  price: string;
};

type PriceGroup = {
  title: string;
  items: PriceItem[];
};

const BIKE_SERVICE_AREAS = [
  {
    title: 'Napęd i przerzutki',
    description: 'Regulacje, wymiana części, serwis suportu oraz linek i pancerzy.',
    icon: Settings,
  },
  {
    title: 'Hamulce',
    description: 'Hamulce mechaniczne i tarczowe, odpowietrzanie oraz prostowanie tarcz.',
    icon: Disc3,
  },
  {
    title: 'Koła i systemy bezdętkowe',
    description: 'Centrowanie, wymiana opon i dętek, serwis piast oraz uszczelniacza.',
    icon: CircleDot,
  },
  {
    title: 'Amortyzatory i pozostały osprzęt',
    description: 'Serwis amortyzatorów, sterów, kierownicy oraz montaż akcesoriów.',
    icon: Wrench,
  },
];

const BIKE_INSPECTIONS = [
  {
    name: 'Przegląd regulacyjny',
    price: '200 zł',
    items: [
      'diagnostyka roweru i kontrola zużycia napędu',
      'regulacja przerzutek i hamulców',
      'kontrola połączeń gwintowych i pompowanie kół',
      'smarowanie napędu',
    ],
  },
  {
    name: 'Przegląd pełny',
    price: '300 zł',
    items: [
      'pełny zakres przeglądu regulacyjnego',
      'centrowanie kół',
      'kasowanie luzów w sterach i piastach',
      'mycie roweru wraz z napędem',
    ],
  },
  {
    name: 'Przegląd PRO',
    price: '550 zł',
    items: [
      'pełny zakres wcześniejszego pakietu',
      'wymiana zużytych części',
      'regeneracja i regulacja piast oraz suportu',
      'czyszczenie i smarowanie sterów',
    ],
  },
  {
    name: 'Przegląd premium',
    price: '650 zł',
    items: [
      'dla rowerów aero, Di2, full suspension i e-bike',
      'pełny zakres przeglądu PRO',
      'diagnostyka Di2 lub AXS',
      'kontrola sworzni zawieszenia kluczem dynamometrycznym',
    ],
  },
];

const BIKE_PRICE_GROUPS: PriceGroup[] = [
  {
    title: 'Napęd i suport',
    items: [
      { name: 'Wymiana wkładu suportu lub czyszczenie i smarowanie', price: '60 zł' },
      { name: 'Wymiana lub naprawa łańcucha', price: '30 zł' },
      { name: 'Naprawa gwintu w korbie', price: '80 zł' },
      { name: 'Wymiana korby', price: '50–90 zł' },
      { name: 'Wymiana koronek korby', price: '80 zł' },
      { name: 'Wymiana wolnobiegu lub kasety', price: '30 zł' },
      { name: 'Wymiana pedałów', price: '30 zł' },
    ],
  },
  {
    title: 'Przerzutki',
    items: [
      { name: 'Regulacja przerzutki przedniej lub tylnej', price: '30 zł' },
      { name: 'Regulacja i prostowanie haka przerzutki', price: '40 zł' },
      { name: 'Wymiana i regulacja przerzutki', price: '50 zł' },
      { name: 'Linka, pancerz i regulacja — prowadzenie wewnętrzne', price: '60 zł' },
      { name: 'Linka, pancerz i regulacja — prowadzenie zewnętrzne', price: '40 zł' },
      { name: 'Wymiana manetki z regulacją', price: '40 zł' },
    ],
  },
  {
    title: 'Hamulce mechaniczne',
    items: [
      { name: 'Regulacja hamulców', price: '20 zł' },
      { name: 'Wymiana klocków, linki lub pancerza z regulacją', price: '40–60 zł' },
      { name: 'Wymiana dźwigni hamulca', price: '40 zł' },
      { name: 'Montaż hamulca — jeden komplet', price: '80 zł' },
    ],
  },
  {
    title: 'Hamulce tarczowe',
    items: [
      { name: 'Regulacja hamulców i prostowanie tarczy', price: '50 zł' },
      { name: 'Odpowietrzanie lub przelewanie hamulca — 1 szt.', price: '40–70 zł' },
      { name: 'Wymiana klocków', price: '30 zł' },
      { name: 'Wymiana zacisku, klamki, przewodu lub płynu z regulacją', price: '50–80 zł' },
      { name: 'Montaż hamulca — jeden komplet', price: '100 zł' },
    ],
  },
  {
    title: 'Amortyzatory',
    items: [
      { name: 'Serwis amortyzatora sprężynowego', price: 'od 120 zł' },
      { name: 'Serwis amortyzatora olejowego bez uszczelek', price: 'od 180 zł' },
      { name: 'Serwis dampera bez uszczelek', price: 'od 180 zł' },
    ],
  },
  {
    title: 'Koła',
    items: [
      { name: 'Wymiana dętki lub opony — koło przednie', price: '30 zł' },
      { name: 'Wymiana dętki lub opony — koło tylne', price: '40–60 zł' },
      { name: 'Wymiana koła przedniego', price: '50 zł' },
      { name: 'Wymiana koła tylnego', price: '70–100 zł' },
      { name: 'Centrowanie koła na rowerze', price: '40 zł' },
      { name: 'Centrowanie na centrownicy z wymianą szprych', price: '60–80 zł' },
      { name: 'Zaplecenie nowego koła', price: '120 zł' },
      { name: 'Wymiana obręczy lub piasty', price: '150 zł' },
      { name: 'Naprawa piasty lub wymiana łożysk', price: '50–100 zł' },
      { name: 'Serwis piasty planetarnej', price: '150 zł' },
    ],
  },
  {
    title: 'Koła bezdętkowe',
    items: [
      { name: 'Montaż nowego koła w systemie bezdętkowym', price: '80 zł' },
      { name: 'Wymiana starego uszczelniacza lub taśmy', price: '100 zł' },
      { name: 'Uzupełnienie uszczelniacza', price: '20 zł' },
    ],
  },
  {
    title: 'Kierownica i stery',
    items: [
      { name: 'Smarowanie i regulacja łożysk sterów', price: '50–100 zł' },
      { name: 'Wymiana sterów', price: '100 zł' },
      { name: 'Nabicie gwiazdki sterów', price: '20 zł' },
      { name: 'Skrócenie kierownicy lub rury sterowej', price: '40 zł' },
      { name: 'Wymiana kierownicy i osprzętu', price: 'od 50 zł' },
      { name: 'Wymiana wspornika kierownicy', price: 'od 40 zł' },
      { name: 'Montaż chwytów lub rogów', price: '20 zł' },
      { name: 'Montaż owijki', price: '60 zł' },
    ],
  },
  {
    title: 'Akcesoria',
    items: [
      { name: 'Montaż błotników', price: '40 zł' },
      { name: 'Montaż bagażnika lub fotelika dziecięcego', price: '50 zł' },
      { name: 'Montaż podpórki, koszyka, bidonu, sztycy lub siodełka', price: '10–30 zł' },
      { name: 'Montaż sztycy regulowanej z prowadzeniem przewodów', price: '150–200 zł' },
      { name: 'Montaż oświetlenia', price: '30 zł' },
      { name: 'Montaż oświetlenia do piasty z dynamem', price: '40 zł' },
      { name: 'Montaż licznika z kalibracją', price: '40 zł' },
    ],
  },
  {
    title: 'Mycie',
    items: [
      { name: 'Czyszczenie tarczy i klocków', price: '30 zł' },
      { name: 'Mycie i smarowanie napędu', price: '50 zł' },
      { name: 'Kompleksowe mycie roweru z napędem', price: '90 zł' },
    ],
  },
];

const WINTER_PRICE_GROUPS: PriceGroup[] = [
  {
    title: 'Narty',
    items: [
      { name: 'Serwis podstawowy — wyrównanie ślizgu i ostrzenie', price: '100 zł' },
      { name: 'Indywidualna struktura', price: 'od 100 zł' },
      { name: 'Smarowanie maszynowe', price: '40 zł' },
      { name: 'Smarowanie ręczne', price: '80 zł' },
      { name: 'Wax Future — smarowanie ręczne i wygrzewanie ślizgu', price: '120 zł' },
    ],
  },
  {
    title: 'Snowboard',
    items: [
      { name: 'Serwis podstawowy — wyrównanie ślizgu i ostrzenie', price: '120 zł' },
      { name: 'Smarowanie maszynowe', price: '40 zł' },
      { name: 'Smarowanie ręczne', price: '100 zł' },
      { name: 'Wax Future — smarowanie ręczne i wygrzewanie ślizgu', price: '140 zł' },
    ],
  },
  {
    title: 'Ślizg i ostrzenie',
    items: [
      { name: 'Uzupełnienie ślizgu', price: 'od 20 zł' },
      { name: 'Ostrzenie maszynowe nart lub snowboardu', price: '70 zł' },
      { name: 'Ręczne ostrzenie nart', price: 'od 120 zł' },
      { name: 'Ręczne ostrzenie snowboardu', price: 'od 90 zł' },
    ],
  },
  {
    title: 'Wiązania',
    items: [
      { name: 'Montaż wiązań do nart zjazdowych', price: '70 zł' },
      { name: 'Montaż wiązań skiturowych', price: '150 zł' },
      { name: 'Montaż wiązań snowboardowych', price: '50 zł' },
      { name: 'Montaż wiązań splitboardowych', price: '110 zł' },
      { name: 'Safetronic — elektroniczna diagnostyka wiązań', price: 'od 50 zł' },
    ],
  },
];

function PriceAccordion({ group: { title, items } }: { group: PriceGroup }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const triggerId = `${panelId}-trigger`;

  return (
    <div className="overflow-hidden rounded-xl border border-app-borderSoft bg-app-surface">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-bold text-app-textStrong"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-app-borderSoft">
            {items.map(({ name, price }, index) => (
              <div
                key={name}
                className={`flex items-start justify-between gap-4 px-5 py-4 ${
                  index % 2 === 0 ? 'bg-app-surfaceSoft/70' : 'bg-app-surface'
                }`}
              >
                <span className="text-sm font-medium leading-6 text-app-textStrong">{name}</span>
                <span className="shrink-0 text-sm font-bold">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceGroupList({ groups }: { groups: PriceGroup[] }) {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      {groups.map((group) => (
        <PriceAccordion key={group.title} group={group} />
      ))}
    </div>
  );
}

export default function ServiceHomePage() {
  return (
    <article>
      <header>
        <p className="mb-3 font-bold uppercase tracking-[0.08em] text-app-textMuted">
          Polar Sport Service
        </p>
        <h1>Serwis rowerowy, narciarski i snowboardowy w Krakowie</h1>
        <p>
          Przygotujemy Twój sprzęt do sezonu, wyjazdu i codziennej jazdy. W jednym miejscu
          wykonujemy przeglądy rowerów oraz profesjonalny serwis nart i snowboardów.
        </p>
      </header>

      <section>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="#serwis-rowerowy"
            onClick={(event) => scrollToSection(event, 'serwis-rowerowy')}
            className="group rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted !no-underline sm:p-8"
          >
            <Bike className="mb-5 h-10 w-10" aria-hidden="true" />
            <h2 className="text-app-textInverted">Serwis rowerowy</h2>
            <p className="mt-3 text-app-textInvertedMuted">
              Przeglądy, napęd, hamulce, amortyzatory, koła i montaż akcesoriów.
            </p>
            <span className="mt-5 inline-block font-semibold">Poznaj zakres usług ↓</span>
          </a>

          <a
            href="#serwis-zimowy"
            onClick={(event) => scrollToSection(event, 'serwis-zimowy')}
            className="group rounded-2xl bg-app-surfaceSoft p-6 text-app-textStrong !no-underline sm:p-8"
          >
            <Snowflake className="mb-5 h-10 w-10" aria-hidden="true" />
            <h2>Serwis nart i snowboardów</h2>
            <p className="mt-3 text-app-textMuted">
              Ostrzenie, przygotowanie ślizgu, smarowanie oraz montaż wiązań.
            </p>
            <span className="mt-5 inline-block font-semibold">Poznaj zakres usług ↓</span>
          </a>
        </div>
      </section>

      <section id="serwis-rowerowy" className="scroll-mt-20">
        <div className="flex items-center gap-4">
          <Bike className="h-9 w-9 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">Rowery</p>
            <h2>Kompleksowa opieka nad rowerem</h2>
          </div>
        </div>
        <p>
          Od szybkiej regulacji po pełny przegląd rowerów tradycyjnych, elektrycznych i z
          zawieszeniem. Zakres prac ustalamy po diagnostyce sprzętu.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {BIKE_SERVICE_AREAS.map(({ title, description, icon: Icon }) => (
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
          <h2>Pakiety przeglądów rowerowych</h2>
          <p className="mt-3 text-app-textMuted">
            Wybierz zakres dopasowany do roweru i jego stanu. Dodatkowe części oraz prace spoza
            pakietu są wyceniane osobno.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {BIKE_INSPECTIONS.map(({ name, price, items }) => (
            <div
              key={name}
              className="flex flex-col gap-4 rounded-xl border border-app-borderSoft p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3>{name}</h3>
                <span className="shrink-0 rounded-full bg-app-surfaceStrong px-3 py-1 text-sm font-bold text-app-textInverted">
                  {price}
                </span>
              </div>
              <div className="grid gap-2">
                {items.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-app-textMuted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-app-textMuted" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-4 rounded-xl bg-app-surfaceSoft p-5 sm:p-6">
            <PackageCheck className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div>
              <h3>Złożenie nowego roweru</h3>
              <p className="mt-2 text-sm text-app-textMuted">Z kartonu wraz z regulacją.</p>
              <p className="mt-3 font-bold">150–200 zł</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-xl bg-app-surfaceSoft p-5 sm:p-6">
            <Zap className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div>
              <h3>Usługa ekspresowa</h3>
              <p className="mt-2 text-sm text-app-textMuted">
                Realizacja priorytetowa po wcześniejszym uzgodnieniu.
              </p>
              <p className="mt-3 font-bold">+50% wartości robocizny</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4">
          <Gauge className="h-8 w-8 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">
              Cennik rowerowy
            </p>
            <h2>Pojedyncze prace serwisowe</h2>
          </div>
        </div>
        <p className="text-app-textMuted">
          Rozwiń kategorię, aby zobaczyć szczegółowy zakres prac i ceny robocizny.
        </p>
        <PriceGroupList groups={BIKE_PRICE_GROUPS} />
      </section>

      <section id="serwis-zimowy" className="scroll-mt-20">
        <div className="flex items-center gap-4">
          <Snowflake className="h-9 w-9 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold uppercase tracking-[0.08em] text-app-textMuted">
              Narty i snowboard
            </p>
            <h2>Przygotowanie sprzętu zimowego</h2>
          </div>
        </div>
        <p>
          Serwisujemy narty zjazdowe i skiturowe, snowboardy oraz splitboardy. Dbamy o ślizg,
          krawędzie i wiązania — od podstawowego przygotowania po ręczne ostrzenie i wygrzewanie
          ślizgu.
        </p>

        <PriceGroupList groups={WINTER_PRICE_GROUPS} />

        <div className="grid gap-4 rounded-xl bg-app-surfaceSoft p-5 sm:grid-cols-[auto_1fr] sm:p-6">
          <Sparkles className="h-7 w-7" aria-hidden="true" />
          <div>
            <h3>Nietypowa naprawa?</h3>
            <p className="mt-2 text-app-textMuted">
              Pozostałe prace serwisowe wyceniamy indywidualnie po obejrzeniu sprzętu. Skontaktuj
              się z nami, jeśli nie widzisz potrzebnej usługi w cenniku.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-8 rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-app-textInverted">Umów serwis</h2>
            <p className="mt-3 text-app-textInvertedMuted">
              Przywieź sprzęt do Polar Sport Strefa Outdoor przy ul. Józefa Kałuży 1 w Krakowie albo
              skontaktuj się z nami przed wizytą.
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
              ul. Józefa Kałuży 1, 30-111 Kraków
            </span>
            <span className="inline-flex items-center gap-3 text-app-textInverted">
              <Clock className="h-5 w-5" aria-hidden="true" />
              Pn–Nd: 10:00–20:00
            </span>
          </div>
        </div>
      </section>
    </article>
  );
}
