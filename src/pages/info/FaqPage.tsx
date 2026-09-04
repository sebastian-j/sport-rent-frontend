import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '../../components/core/PageTitle.tsx';
import {
  MAX_POINTS_PAYMENT_SHARE,
  PLN_SPENT_PER_POINT_EARNED,
  POINTS_REQUIRED_PER_PLN,
} from '../../features/loyalty/constants.ts';
import { INFO_ROUTES, RENT_ROUTES } from '../../routes.ts';

type FaqItemProps = {
  question: string;
  children: ReactNode;
};

function FaqItem({ question, children }: FaqItemProps) {
  return (
    <details className="group rounded-xl bg-app-surfaceSoft px-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <ChevronDown
          className="shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-app-borderSoft pb-5 pt-4 text-app-textMuted">{children}</div>
    </details>
  );
}

export default function FaqPage() {
  return (
    <article>
      <header>
        <PageTitle>Najczęściej zadawane pytania</PageTitle>
        <p>
          Zebraliśmy odpowiedzi na pytania dotyczące wypożyczania sprzętu, programu lojalnościowego
          i kontaktu z Polar Sport Rent.
        </p>
      </header>

      <section>
        <h2>Rezerwacja i sprzęt</h2>
        <div className="grid items-start gap-3 lg:grid-cols-2">
          <FaqItem question="Jak wypożyczyć sprzęt?">
            <p>
              Wyszukaj interesujący Cię sprzęt, wybierz termin, sprawdź szczegóły oferty i złóż
              rezerwację online. Przygotowane wyposażenie odbierzesz przed wyjazdem, a po
              zakończeniu wypożyczenia zwrócisz je w ustalonym terminie.
            </p>
          </FaqItem>

          <FaqItem question="Jak sprawdzić dostępność w wybranym terminie?">
            <p>
              Przejdź do <Link to={RENT_ROUTES.search}>wyszukiwarki sprzętu</Link> i wybierz
              interesujący Cię termin. Zobaczysz oferty, które możesz dopasować do planowanej
              aktywności.
            </p>
          </FaqItem>

          <FaqItem question="Jaki sprzęt mogę wypożyczyć?">
            <p>
              W ofercie znajdziesz między innymi rowery, przyczepki rowerowe, namioty, sprzęt wodny,
              wyposażenie wspinaczkowe i via ferrata oraz nosidełka turystyczne.
            </p>
          </FaqItem>

          <FaqItem question="Nie wiem, jaki sprzęt wybrać. Czy możecie pomóc?">
            <p>
              Tak. Opisz planowany termin, miejsce wyjazdu, rodzaj aktywności oraz liczbę osób. Dane
              kontaktowe znajdziesz na <Link to={INFO_ROUTES.contact}>stronie kontaktowej</Link>.
            </p>
          </FaqItem>
        </div>
      </section>

      <section>
        <h2>Program lojalnościowy</h2>
        <div className="grid items-start gap-3 lg:grid-cols-2">
          <FaqItem question="Jak zdobywam punkty?">
            <p>
              Za każde wydane {PLN_SPENT_PER_POINT_EARNED} zł otrzymujesz 1 punkt. Jeśli wartość
              zamówienia zawiera grosze, wynik zaokrąglamy w dół do pełnego punktu.
            </p>
          </FaqItem>

          <FaqItem question="Ile punktów mogę wykorzystać w zamówieniu?">
            <p>
              Jeden punkt daje 0,50 zł rabatu, a punktami można pokryć maksymalnie{' '}
              {MAX_POINTS_PAYMENT_SHARE * 100}% zamówienia. Dla zamówienia za 75 zł limit wynosi{' '}
              {Math.floor(75 * MAX_POINTS_PAYMENT_SHARE * POINTS_REQUIRED_PER_PLN)} punktów.
            </p>
          </FaqItem>

          <FaqItem question="Kiedy mogę zapłacić punktami?">
            <p>
              Punkty możesz wykorzystać po osiągnięciu 500 zł kwalifikujących wydatków. Nie musisz
              posiadać punktów wystarczających do pokrycia całego dostępnego limitu.
            </p>
          </FaqItem>

          <FaqItem question="Gdzie znajdę więcej informacji o punktach?">
            <p>
              Zasady oraz przykładowe obliczenia opisaliśmy na stronie{' '}
              <Link to={INFO_ROUTES.loyaltyPoints}>programu lojalnościowego</Link>.
            </p>
          </FaqItem>
        </div>
      </section>

      <section>
        <h2>Kontakt i odbiór</h2>
        <div className="grid items-start gap-3 lg:grid-cols-2">
          <FaqItem question="Gdzie znajduje się wypożyczalnia?">
            <p>Polar Sport Rent znajduje się przy ul. Kałuży 1 w Krakowie.</p>
          </FaqItem>

          <FaqItem question="W jakich godzinach jesteście otwarci?">
            <p>
              Od poniedziałku do piątku pracujemy w godzinach 10:00–20:00, a w soboty i niedziele od
              11:00 do 18:00.
            </p>
          </FaqItem>

          <FaqItem question="Jak mogę się z Wami skontaktować?">
            <p>
              Zadzwoń pod numer <a href="tel:+48798798798">798 798 798</a> lub napisz na adres{' '}
              <a href="mailto:Kontakt@psrent.pl">Kontakt@psrent.pl</a>.
            </p>
          </FaqItem>
        </div>
      </section>

      <section className="rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted sm:p-8">
        <h2>Nie znalazłeś odpowiedzi?</h2>
        <p className="text-app-textInvertedMuted">
          Skontaktuj się z nami, a postaramy się pomóc w wyborze sprzętu lub wyjaśnić szczegóły
          rezerwacji.
        </p>
        <p>
          <Link to={INFO_ROUTES.contact}>Przejdź do kontaktu</Link>
        </p>
      </section>
    </article>
  );
}
