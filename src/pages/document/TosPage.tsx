import { Link } from 'react-router-dom';

const TERMS_DATA = {
  brand_name: 'PS Rent & Service',
  company_name: 'Mikstura A. Radwańska, A. Radwański s.c.',
  registered_address: 'ul. Stradomska 19, 31-068 Kraków',
  pickup_address: 'ul. Józefa Kałuży 1, 30-111 Kraków',
  nip: '6762528228',
  regon: '367115799',
  contact_email: 'kontakt@psrent.pl',
  contact_phone: '+48 570 440 636',
  payment_provider_name: 'Przelewy24',
  payment_provider_operator: 'PayPro S.A.',
  payment_provider_address: 'ul. Kanclerska 15, 60-327 Poznań',
  payment_provider_nip: '7792369887',
  google_payment_name: 'Google Pay',
  free_cancellation_hours: 48,
  late_cancellation_fee_percent: 50,
  complaint_processing_days: 14,
  privacy_policy_path: '/privacy-policy',
  effective_date: new Date().toUTCString(),
  last_updated_at: new Date().toUTCString(),
};

export default function TosPage() {
  return (
    <article>
      <header>
        <p>Dokument prawny</p>
        <h1>Regulamin wypożyczalni</h1>
        <p>Ostatnia aktualizacja: {TERMS_DATA.last_updated_at}</p>
      </header>

      <section>
        <h2>§1. Dane przedsiębiorcy</h2>
        <ol>
          <li>
            Wypożyczalnię sprzętu outdoorowego działającą pod nazwą {TERMS_DATA.brand_name} prowadzi{' '}
            {TERMS_DATA.company_name} z siedzibą pod adresem {TERMS_DATA.registered_address}, NIP:{' '}
            {TERMS_DATA.nip}, REGON: {TERMS_DATA.regon}.
          </li>
          <li>Sprzęt jest wydawany i przyjmowany pod adresem {TERMS_DATA.pickup_address}.</li>
          <li>
            Z wypożyczalnią można skontaktować się przez e-mail {TERMS_DATA.contact_email} lub
            telefonicznie pod numerem {TERMS_DATA.contact_phone}.
          </li>
        </ol>
      </section>

      <section>
        <h2>§2. Postanowienia ogólne</h2>
        <ol>
          <li>
            Regulamin opisuje zasady rezerwowania, wynajmowania, opłacania, odbierania i zwracania
            sprzętu outdoorowego oferowanego przez wypożyczalnię.
          </li>
          <li>Złożenie rezerwacji przez internet oznacza zaakceptowanie niniejszego regulaminu.</li>
          <li>
            Treść regulaminu jest dostępna w serwisie internetowym oraz w punkcie wypożyczalni.
          </li>
          <li>
            Klient ma obowiązek używać sprzętu zgodnie z przeznaczeniem, zasadami bezpieczeństwa i
            instrukcjami przekazanymi przez pracownika wypożyczalni.
          </li>
        </ol>
      </section>

      <section>
        <h2>§3. Rezerwacja sprzętu</h2>
        <ol>
          <li>
            Rezerwację można złożyć przez stronę internetową, osobiście w punkcie wypożyczalni,
            telefonicznie albo pocztą elektroniczną. Rezerwacja telefoniczna lub mailowa wymaga
            potwierdzenia przez pracownika.
          </li>
          <li>
            Podczas rezerwacji internetowej Klient wskazuje wybrany sprzęt, okres wynajmu oraz
            metodę płatności.
          </li>
          <li>
            Rezerwacja staje się wiążąca po potwierdzeniu dostępności sprzętu oraz dokonaniu
            płatności internetowej lub wymaganej wpłaty zgodnie z §4.
          </li>
          <li>
            Wypożyczalnia może odmówić realizacji rezerwacji, jeżeli zamówienie nie zostało opłacone
            w wymaganym terminie, podano nieprawdziwe dane albo wybrany sprzęt nie jest dostępny.
          </li>
        </ol>
      </section>

      <section>
        <h2>§4. Płatności</h2>
        <ol>
          <li>
            Opłatę za rezerwację można uiścić online za pośrednictwem{' '}
            {TERMS_DATA.payment_provider_name} lub {TERMS_DATA.google_payment_name}, tradycyjnym
            przelewem na rachunek wypożyczalni albo gotówką lub kartą podczas odbioru, jeżeli taka
            możliwość została udostępniona.
          </li>
          <li>
            Operatorem płatności {TERMS_DATA.payment_provider_name} jest{' '}
            {TERMS_DATA.payment_provider_operator} z siedzibą pod adresem{' '}
            {TERMS_DATA.payment_provider_address}, NIP: {TERMS_DATA.payment_provider_nip}.
          </li>
          <li>Płatności online są przesyłane przy użyciu zabezpieczonego połączenia.</li>
          <li>
            Zwrot środków po anulowaniu rezerwacji przed początkiem wynajmu odbywa się na zasadach
            określonych w §8.
          </li>
        </ol>
      </section>

      <section>
        <h2>§5. Wydanie sprzętu</h2>
        <ol>
          <li>Sprzęt jest wydawany w punkcie pod adresem {TERMS_DATA.pickup_address}.</li>
          <li>
            Przy odbiorze Klient powinien okazać ważny dokument tożsamości, taki jak dowód osobisty,
            paszport lub prawo jazdy.
          </li>
          <li>
            Klient podpisuje umowę wypożyczenia, potwierdzając stan techniczny i kompletność
            sprzętu, zapoznanie się z zasadami użytkowania oraz przyjęcie odpowiedzialności za
            przekazane wyposażenie.
          </li>
          <li>
            W zależności od rodzaju sprzętu wypożyczalnia może wymagać wpłacenia zwrotnej kaucji.
          </li>
        </ol>
      </section>

      <section>
        <h2>§6. Korzystanie ze sprzętu</h2>
        <ol>
          <li>
            Klient powinien korzystać ze sprzętu zgodnie z jego przeznaczeniem i zachować należytą
            staranność.
          </li>
          <li>
            Bez wcześniejszej zgody wypożyczalni nie wolno naprawiać, modyfikować ani przerabiać
            sprzętu.
          </li>
          <li>
            Klient odpowiada za zawinione uszkodzenie, utratę lub zniszczenie powierzonego sprzętu.
          </li>
          <li>
            Uszkodzenie, awarię albo zaginięcie sprzętu należy niezwłocznie zgłosić wypożyczalni.
          </li>
        </ol>
      </section>

      <section>
        <h2>§7. Zwrot sprzętu</h2>
        <ol>
          <li>Sprzęt należy oddać najpóźniej w terminie wskazanym w umowie.</li>
          <li>Zwracany sprzęt powinien być kompletny, czysty i w stanie niepogorszonym.</li>
          <li>
            Za każdy rozpoczęty dzień opóźnienia może zostać naliczona dodatkowa opłata
            odpowiadająca obowiązującej stawce dziennej.
          </li>
          <li>
            Jeżeli przy zwrocie zostaną stwierdzone zawinione uszkodzenia lub braki, Klient może
            zostać obciążony uzasadnionymi kosztami naprawy albo zastąpienia sprzętu.
          </li>
        </ol>
      </section>

      <section>
        <h2>§8. Anulowanie rezerwacji i zwrot płatności</h2>
        <ol>
          <li>
            Rezerwację można anulować bez opłat najpóźniej {TERMS_DATA.free_cancellation_hours}{' '}
            godzin przed ustalonym odbiorem sprzętu.
          </li>
          <li>
            Przy anulowaniu w czasie krótszym niż {TERMS_DATA.free_cancellation_hours} godzin przed
            odbiorem wypożyczalnia może potrącić {TERMS_DATA.late_cancellation_fee_percent}%
            wartości rezerwacji.
          </li>
          <li>
            Jeżeli Klient nie stawi się w uzgodnionym terminie i wcześniej nie powiadomi
            wypożyczalni, rezerwacja może zostać anulowana bez zwrotu wpłaconej kwoty.
          </li>
          <li>
            Należny zwrot jest dokonywany tą samą metodą, którą wykorzystano do zapłaty, chyba że
            strony uzgodnią inaczej.
          </li>
        </ol>
      </section>

      <section>
        <h2>§9. Odpowiedzialność i ubezpieczenie</h2>
        <ol>
          <li>
            Klient korzysta ze sprzętu na własną odpowiedzialność i powinien stosować wymagane
            środki bezpieczeństwa oraz odpowiednio zabezpieczać wypożyczone wyposażenie.
          </li>
          <li>
            Wypożyczalnia odpowiada za szkody na zasadach wynikających z obowiązujących przepisów.
            Regulamin nie wyłącza odpowiedzialności, której nie można ograniczyć umową.
          </li>
          <li>
            Sprzęt nie jest objęty ochroną od kradzieży, zagubienia lub uszkodzenia, chyba że umowa
            dotycząca konkretnego wypożyczenia stanowi inaczej.
          </li>
        </ol>
      </section>

      <section>
        <h2>§10. Dane osobowe</h2>
        <ol>
          <li>Administratorem danych osobowych Klientów jest {TERMS_DATA.company_name}.</li>
          <li>
            Dane są wykorzystywane do obsługi rezerwacji, zawarcia i wykonania umowy oraz realizacji
            obowiązków wynikających z prawa.
          </li>
          <li>
            Klient może między innymi uzyskać dostęp do danych, poprawić je, zażądać usunięcia lub
            ograniczenia przetwarzania oraz wnieść sprzeciw w przypadkach przewidzianych przez
            prawo.
          </li>
          <li>
            Dane mogą być udostępniane podmiotom niezbędnym do obsługi płatności i księgowości oraz
            innym odbiorcom wskazanym w polityce prywatności.
          </li>
          <li>
            Szczegółowe informacje znajdują się w{' '}
            <Link to={TERMS_DATA.privacy_policy_path}>Polityce prywatności</Link>.
          </li>
        </ol>
      </section>

      <section>
        <h2>§11. Reklamacje</h2>
        <ol>
          <li>
            Nieprawidłowości dotyczące rezerwacji lub stanu sprzętu należy zgłosić możliwie szybko
            po ich zauważeniu.
          </li>
          <li>
            Reklamację można złożyć osobiście w punkcie wypożyczalni albo wysłać na adres{' '}
            {TERMS_DATA.contact_email}.
          </li>
          <li>
            Odpowiedź na reklamację zostanie udzielona nie później niż w ciągu{' '}
            {TERMS_DATA.complaint_processing_days} dni od jej otrzymania, chyba że bezwzględnie
            obowiązujące przepisy wyznaczają inny termin.
          </li>
        </ol>
      </section>

      <section>
        <h2>§12. Postanowienia końcowe</h2>
        <ol>
          <li>
            W kwestiach nieopisanych w regulaminie stosuje się odpowiednie przepisy Kodeksu
            cywilnego i ustawy o prawach konsumenta.
          </li>
          <li>
            Spory wynikające z umowy rozpatruje sąd właściwy zgodnie z powszechnie obowiązującymi
            przepisami.
          </li>
          <li>Regulamin obowiązuje od {TERMS_DATA.effective_date}.</li>
          <li>
            Wypożyczalnia może zmienić regulamin w związku ze zmianą prawa lub zasad świadczenia
            usług. Zaktualizowana wersja obowiązuje od chwili jej opublikowania, z poszanowaniem
            praw nabytych przez Klientów.
          </li>
        </ol>
      </section>
    </article>
  );
}
