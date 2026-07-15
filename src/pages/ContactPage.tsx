import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <article>
      <header>
        <h1>Skontaktuj się z nami</h1>
        <p>
          Masz pytanie o sprzęt, rezerwację albo przygotowanie do wyjazdu? Zadzwoń, napisz lub
          odwiedź naszą wypożyczalnię w Krakowie.
        </p>
      </header>

      <section>
        <h2>Odwiedź nas</h2>
        <div className="grid overflow-hidden rounded-xl bg-app-surfaceSoft lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.8fr)]">
          <div className="p-6 sm:p-8">
            <MapPin className="mb-4" aria-hidden="true" />
            <h3>Polar Sport Rent</h3>
            <address className="mt-3 not-italic text-app-textMuted">
              ul. Kałuży 1
              <br />
              Kraków
            </address>
            <a
              href="https://www.openstreetmap.org/?mlat=50.05825&mlon=19.922111#map=17/50.05825/19.922111"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block"
            >
              Otwórz większą mapę
            </a>
          </div>

          <iframe
            title="Mapa dojazdu do Polar Sport Rent"
            src="https://www.openstreetmap.org/export/embed.html?bbox=19.916%2C50.0545%2C19.928%2C50.062&layer=mapnik&marker=50.05825%2C19.922111"
            loading="lazy"
            className="min-h-72 w-full border-0 lg:h-full"
          />
        </div>
      </section>

      <section>
        <h2>Wybierz najwygodniejszy sposób kontaktu</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-app-surfaceSoft p-6">
            <Phone className="mb-4" aria-hidden="true" />
            <h3>Zadzwoń</h3>
            <p className="mt-3 text-app-textMuted">
              <a href="tel:+48798798798">798 798 798</a>
            </p>
            <p className="mt-2 text-sm text-app-textMuted">
              Telefonicznie pomożemy sprawdzić dostępność i dobrać odpowiedni sprzęt.
            </p>
          </div>

          <div className="rounded-xl bg-app-surfaceSoft p-6">
            <Mail className="mb-4" aria-hidden="true" />
            <h3>Napisz wiadomość</h3>
            <p className="mt-3 text-app-textMuted">
              <a href="mailto:Kontakt@psrent.pl">Kontakt@psrent.pl</a>
            </p>
            <p className="mt-2 text-sm text-app-textMuted">
              Opisz planowany termin i rodzaj aktywności, a łatwiej będzie nam przygotować
              odpowiedź.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="grid gap-8 rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted md:grid-cols-2 sm:p-8">
          <div>
            <Clock className="mb-4" aria-hidden="true" />
            <h2>Godziny otwarcia</h2>
            <p className="mt-3 text-app-textInvertedMuted">
              W tych godzinach możesz skontaktować się z nami oraz odebrać lub zwrócić sprzęt.
            </p>
          </div>

          <dl className="space-y-4 self-center">
            <div className="flex items-center justify-between gap-6 border-b border-white/20 pb-4">
              <dt>Poniedziałek–piątek</dt>
              <dd className="font-semibold">10:00–20:00</dd>
            </div>
            <div className="flex items-center justify-between gap-6">
              <dt>Sobota–niedziela</dt>
              <dd className="font-semibold">11:00–18:00</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <h2>Jak przygotować wiadomość?</h2>
        <p>
          Jeśli pytasz o konkretną rezerwację, podaj jej numer lub adres e-mail użyty podczas
          składania zamówienia. W przypadku pomocy w wyborze sprzętu napisz, dokąd jedziesz, w jakim
          terminie i ile osób będzie z niego korzystać.
        </p>
      </section>
    </article>
  );
}
