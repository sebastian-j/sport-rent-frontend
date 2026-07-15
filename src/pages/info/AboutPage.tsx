import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <article>
      <header>
        <h1>Sprzęt na przygodę, nie na półkę</h1>
        <p>
          SportRent powstał po to, by ułatwiać aktywny wypoczynek. Wybierasz kierunek, a my pomagamy
          dobrać sprzęt, który pozwoli Ci ruszyć w drogę bez kosztownych zakupów i przechowywania
          rzeczy używanych tylko kilka razy w roku.
        </p>
      </header>

      <section>
        <h2>Przygoda zaczyna się od dobrego przygotowania</h2>
        <p>
          Niezależnie od tego, czy planujesz spokojną wycieczkę rowerową, weekend pod namiotem,
          dzień na wodzie czy pierwszą wyprawę w góry, chcemy maksymalnie uprościć etap przygotowań.
          W jednym miejscu porównasz dostępny sprzęt, sprawdzisz termin i zarezerwujesz wszystko,
          czego potrzebujesz.
        </p>
        <p>
          Wierzymy, że nie trzeba posiadać każdego elementu wyposażenia, aby próbować nowych
          aktywności. Wypożyczanie daje swobodę eksperymentowania, pozwala lepiej dopasować sprzęt
          do konkretnego wyjazdu i ogranicza liczbę przedmiotów, które przez większość roku
          pozostają nieużywane.
        </p>
      </section>

      <section>
        <h2>Co jest dla nas ważne?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-app-surfaceSoft p-6">
            <h3>Sprawdzony sprzęt</h3>
            <p className="mt-3 text-app-textMuted">
              Wyposażenie powinno być gotowe wtedy, kiedy Ty jesteś. Dlatego stawiamy na jasny opis,
              dobry stan techniczny i przewidywalny proces odbioru.
            </p>
          </div>

          <div className="rounded-xl bg-app-surfaceSoft p-6">
            <h3>Prosty wybór</h3>
            <p className="mt-3 text-app-textMuted">
              Kategorie, terminy i najważniejsze parametry prezentujemy w czytelny sposób, aby
              decyzja nie wymagała przekopywania się przez niepotrzebne informacje.
            </p>
          </div>

          <div className="rounded-xl bg-app-surfaceSoft p-6">
            <h3>Więcej możliwości</h3>
            <p className="mt-3 text-app-textMuted">
              Dziś rower, za tydzień kajak, a zimą sprzęt turystyczny. Możesz zmieniać plany bez
              konieczności kompletowania własnego magazynu wyposażenia.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Jak działamy?</h2>
        <ol>
          <li>Wyszukujesz sprzęt i wybierasz odpowiadający Ci termin.</li>
          <li>Sprawdzasz szczegóły oferty i składasz rezerwację online.</li>
          <li>Odbierasz przygotowany sprzęt i ruszasz realizować swój plan.</li>
          <li>Po zakończonej przygodzie zwracasz wyposażenie w ustalonym terminie.</li>
        </ol>
      </section>

      <section className="rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted sm:p-8">
        <h2>Masz już pomysł na kolejny wyjazd?</h2>
        <p className="text-app-textInvertedMuted">
          Zobacz dostępny sprzęt albo napisz do nas, jeśli potrzebujesz pomocy w wyborze.
        </p>
        <div className="flex flex-wrap gap-6 pt-2">
          <Link to="/search">Przeglądaj sprzęt</Link>
          <Link to="/contact">Skontaktuj się z nami</Link>
        </div>
      </section>
    </article>
  );
}
