// Based on https://psrentservice.pl/polityka-prywatnosci/

const PRIVACY_POLICY_DATA = {
  admin_name: 'Mikstura A. Radwańska, A. Radwański s.c.',
  admin_address: 'ul. Stradomska 19, 31-068 Kraków',
  admin_nip: '6762528228',
  admin_regon: '367115799',
  admin_email: 'example@example.com',
  admin_phone: '+48 123 456 789',
  privacy_email: 'p_example@example.com',
  tax_retention_years: 5,
  przelewy24_name: 'Przelewy24',
  przelewy24_operator: 'PayPro S.A.',
  przelewy24_privacy_policy_url: 'https://www.przelewy24.pl/polityka-prywatnosci',
  google_pay_name: 'Google Pay',
  google_operator: 'Google Ireland Ltd.',
  google_privacy_policy_url: 'https://policies.google.com/privacy',
  effective_date: new Date().toUTCString(),
  last_updated_at: new Date().toUTCString(),
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <header>
        <p>Dokument prawny</p>
        <h1>Polityka prywatności</h1>
        <p>Ostatnia aktualizacja: {PRIVACY_POLICY_DATA.last_updated_at}</p>
      </header>

      <section>
        <h2>§1. Postanowienia ogólne</h2>
        <ol>
          <li>
            Niniejszy dokument opisuje sposób przetwarzania i zabezpieczania danych osobowych osób
            korzystających z usług wypożyczalni sprzętu outdoorowego prowadzonej przez{' '}
            {PRIVACY_POLICY_DATA.admin_name}.
          </li>
          <li>
            Administratorem danych osobowych jest {PRIVACY_POLICY_DATA.admin_name},{' '}
            {PRIVACY_POLICY_DATA.admin_address}, NIP: {PRIVACY_POLICY_DATA.admin_nip}, REGON:{' '}
            {PRIVACY_POLICY_DATA.admin_regon}. Z Administratorem można skontaktować się pod adresem
            e-mail {PRIVACY_POLICY_DATA.admin_email} lub numerem telefonu{' '}
            {PRIVACY_POLICY_DATA.admin_phone}.
          </li>
          <li>
            Dane są przetwarzane zgodnie z RODO, ustawą o ochronie danych osobowych oraz pozostałymi
            przepisami mającymi zastosowanie do działalności Administratora.
          </li>
        </ol>
      </section>

      <section>
        <h2>§2. Zakres przetwarzanych danych</h2>
        <ol>
          <li>
            Dane osobowe są wykorzystywane w zakresie potrzebnym do przyjęcia rezerwacji online lub
            w punkcie obsługi, zawarcia i wykonania umowy wypożyczenia, rozliczenia płatności,
            kontaktu w sprawach rezerwacji, zwrotów i reklamacji oraz realizacji obowiązków
            księgowych i podatkowych.
          </li>
          <li>
            W zależności od wybranej usługi Administrator może przetwarzać imię i nazwisko, adres
            e-mail, numer telefonu, adres zamieszkania lub dane do faktury, dane dokumentu
            tożsamości okazywanego przy odbiorze sprzętu, informacje o płatności, adres IP oraz dane
            dotyczące aktywności w serwisie.
          </li>
        </ol>
      </section>

      <section>
        <h2>§3. Cele i podstawy prawne przetwarzania</h2>
        <ul>
          <li>
            Rezerwacja sprzętu oraz zawarcie i realizacja umowy wypożyczenia odbywają się na
            podstawie art. 6 ust. 1 lit. b RODO.
          </li>
          <li>
            Obsługa płatności internetowych odbywa się na podstawie art. 6 ust. 1 lit. b oraz lit. f
            RODO. Uzasadnionym interesem Administratora jest zapewnienie sprawnego i bezpiecznego
            rozliczenia usługi.
          </li>
          <li>
            Wystawianie faktur i prowadzenie dokumentacji księgowej odbywa się na podstawie art. 6
            ust. 1 lit. c RODO, czyli w celu wykonania obowiązków prawnych Administratora.
          </li>
          <li>
            Kontakt z klientem oraz obsługa pytań, zwrotów i reklamacji odbywają się na podstawie
            art. 6 ust. 1 lit. b lub lit. f RODO.
          </li>
          <li>
            Newsletter i marketing własnych usług są prowadzone na podstawie dobrowolnej zgody, o
            której mowa w art. 6 ust. 1 lit. a RODO.
          </li>
          <li>
            Ustalenie, dochodzenie lub obrona przed roszczeniami oraz ochrona serwisu odbywają się
            na podstawie prawnie uzasadnionego interesu Administratora zgodnie z art. 6 ust. 1 lit.
            f RODO.
          </li>
          <li>
            Analiza ruchu, statystyka i ulepszanie działania strony mogą być prowadzone na podstawie
            art. 6 ust. 1 lit. f RODO, z uwzględnieniem wymagań dotyczących zgody na cookies.
          </li>
        </ul>
      </section>

      <section>
        <h2>§4. Udostępnianie i przekazywanie danych</h2>
        <ol>
          <li>
            Dane mogą otrzymywać operatorzy płatności {PRIVACY_POLICY_DATA.przelewy24_operator}{' '}
            działający pod marką {PRIVACY_POLICY_DATA.przelewy24_name} oraz{' '}
            {PRIVACY_POLICY_DATA.google_operator}, biuro księgowe, dostawcy hostingu i usług
            informatycznych, podmioty zapewniające serwis i pomoc techniczną, a także uprawnione
            organy publiczne.
          </li>
          <li>
            Co do zasady dane nie są przekazywane poza Europejski Obszar Gospodarczy. Jeżeli
            korzystanie z usług Google wiąże się z takim transferem, odbywa się on z zastosowaniem
            mechanizmów ochronnych przewidzianych w RODO, w szczególności standardowych klauzul
            umownych.
          </li>
        </ol>
      </section>

      <section>
        <h2>§5. Okres przechowywania danych</h2>
        <ol>
          <li>
            Dane związane z wypożyczeniem są przechowywane przez czas obowiązywania umowy i jej
            rozliczenia, a następnie do upływu terminu przedawnienia możliwych roszczeń.
          </li>
          <li>
            Dokumentacja podatkowa i księgowa jest przechowywana przez okres wynikający z przepisów,
            zazwyczaj przez {PRIVACY_POLICY_DATA.tax_retention_years} lat liczonych od końca
            właściwego roku obrotowego.
          </li>
          <li>
            Dane wykorzystywane do marketingu są przetwarzane do czasu wycofania zgody lub ustania
            celu ich wykorzystywania.
          </li>
          <li>
            Po zakończeniu właściwego okresu dane są usuwane w trwały sposób albo anonimizowane.
          </li>
        </ol>
      </section>

      <section>
        <h2>§6. Prawa osób, których dane dotyczą</h2>
        <p>Osobie, której dane są przetwarzane, przysługuje prawo do:</p>
        <ul>
          <li>uzyskania dostępu do danych oraz ich kopii,</li>
          <li>poprawienia nieprawidłowych lub nieaktualnych informacji,</li>
          <li>żądania usunięcia danych, jeżeli zachodzą ku temu podstawy prawne,</li>
          <li>ograniczenia sposobu przetwarzania,</li>
          <li>otrzymania danych w formacie umożliwiającym ich przeniesienie,</li>
          <li>wniesienia sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie,</li>
          <li>cofnięcia udzielonej zgody w dowolnym momencie,</li>
          <li>
            złożenia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeżeli przetwarzanie narusza
            przepisy.
          </li>
        </ul>
        <p>
          Cofnięcie zgody nie wpływa na zgodność z prawem działań wykonanych przed jej wycofaniem.
        </p>
      </section>

      <section>
        <h2>§7. Bezpieczeństwo danych</h2>
        <ol>
          <li>
            Administrator stosuje rozwiązania organizacyjne i techniczne mające chronić dane przed
            utratą, przypadkowym zniszczeniem, zmianą, ujawnieniem oraz dostępem osób
            nieupoważnionych.
          </li>
          <li>
            Transmisja danych podczas rezerwacji i płatności internetowych jest zabezpieczona przy
            użyciu szyfrowanego połączenia SSL.
          </li>
          <li>
            Dostęp do danych otrzymują wyłącznie osoby upoważnione przez Administratora, które
            potrzebują ich do wykonywania swoich obowiązków.
          </li>
        </ol>
      </section>

      <section>
        <h2>§8. Pliki cookies</h2>
        <ol>
          <li>
            Serwis wykorzystuje pliki cookies potrzebne do prawidłowego działania strony, tworzenia
            statystyk oraz zapamiętywania ustawień i zawartości koszyka użytkownika.
          </li>
          <li>
            Administrator nie umieszcza w cookies informacji, których bezpośrednim celem jest
            identyfikacja konkretnej osoby.
          </li>
          <li>
            Użytkownik może ograniczyć lub wyłączyć cookies w ustawieniach swojej przeglądarki.
            Zmiana ustawień może wpłynąć na działanie niektórych funkcji strony.
          </li>
          <li>
            Cookies, które nie są niezbędne do działania serwisu, są wykorzystywane zgodnie z
            wyborem dokonanym przez użytkownika.
          </li>
        </ol>
      </section>

      <section>
        <h2>§9. Płatności internetowe</h2>
        <ol>
          <li>
            W celu rozliczenia płatności niezbędny zakres danych transakcyjnych może zostać
            przekazany do {PRIVACY_POLICY_DATA.przelewy24_name}, którego operatorem jest{' '}
            {PRIVACY_POLICY_DATA.przelewy24_operator}, albo do usługi{' '}
            {PRIVACY_POLICY_DATA.google_pay_name}.
          </li>
          <li>
            Operatorzy płatności działają zgodnie z własnymi zasadami ochrony danych. Szczegółowe
            informacje znajdują się w polityce prywatności {PRIVACY_POLICY_DATA.przelewy24_name}{' '}
            dostępnej pod adresem{' '}
            <a href={PRIVACY_POLICY_DATA.przelewy24_privacy_policy_url}>
              {PRIVACY_POLICY_DATA.przelewy24_privacy_policy_url}
            </a>{' '}
            oraz polityce Google dostępnej pod adresem{' '}
            <a href={PRIVACY_POLICY_DATA.google_privacy_policy_url}>
              {PRIVACY_POLICY_DATA.google_privacy_policy_url}
            </a>
            .
          </li>
        </ol>
      </section>

      <section>
        <h2>§10. Zmiany polityki prywatności</h2>
        <ol>
          <li>
            Administrator może aktualizować niniejszy dokument, w szczególności w razie zmiany
            przepisów, zakresu usług lub sposobu przetwarzania danych.
          </li>
          <li>Nowa wersja obowiązuje od chwili opublikowania jej w serwisie internetowym.</li>
        </ol>
      </section>

      <section>
        <h2>§11. Kontakt w sprawach ochrony danych</h2>
        <p>
          Wnioski i pytania dotyczące danych osobowych można kierować na adres e-mail{' '}
          {PRIVACY_POLICY_DATA.privacy_email}, pod numer telefonu {PRIVACY_POLICY_DATA.admin_phone}{' '}
          lub pocztą na adres: {PRIVACY_POLICY_DATA.admin_name}, {PRIVACY_POLICY_DATA.admin_address}
          .
        </p>
      </section>

      <section>
        <h2>§12. Postanowienia końcowe</h2>
        <p>Polityka prywatności obowiązuje od {PRIVACY_POLICY_DATA.effective_date}.</p>
        <p>Ostatnia aktualizacja: {PRIVACY_POLICY_DATA.last_updated_at}.</p>
      </section>
    </article>
  );
}
