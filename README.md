# SportRent Frontend

Frontend aplikacji SportRent — platformy do wypożyczania sprzętu sportowego
i turystycznego.

SportRent ma ułatwiać przygotowanie do aktywnego wypoczynku. Użytkownik może
w jednym miejscu wyszukać sprzęt, porównać dostępne produkty, wybrać termin
wypożyczenia i przejść przez proces rezerwacji. Dzięki temu nie musi kupować
i przechowywać wyposażenia używanego tylko kilka razy w roku.

Projekt składa się z dwóch współpracujących aplikacji:

- [`sport-rent-frontend`](https://github.com/sebastian-j/sport-rent-frontend) —
  interfejs użytkownika napisany w React;
- [`sport-rent-backend`](https://github.com/sebastian-j/sport-rent-backend) —
  REST API aplikacji.

## Główne funkcje

- katalog sprzętu z wyszukiwaniem, filtrowaniem, sortowaniem i paginacją;
- strony szczegółów produktów oraz sprawdzanie dostępności w wybranym terminie;
- koszyk z terminami wypożyczenia, wariantami produktów i podsumowaniem ceny;
- lista ulubionych produktów;
- logowanie i ochrona stron przeznaczonych dla zalogowanych użytkowników;
- profil użytkownika z historią zamówień i programem lojalnościowym;
- obsługa kodów promocyjnych i podsumowanie zamówienia;
- responsywny interfejs dostosowany do urządzeń mobilnych i komputerów;
- jasny, ciemny i zgodny z ustawieniami systemu motyw interfejsu;
- strony informacyjne, FAQ, regulamin i polityka prywatności.

## Stan projektu

Frontend realizuje docelową ścieżkę wypożyczenia, ale część operacji backendu
ma jeszcze charakter demonstracyjny.

| Obszar                                      | Aktualny stan                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------- |
| Katalog, wyszukiwanie i szczegóły produktów | Połączone z API                                                              |
| Sprawdzanie dostępności                     | Połączone z demonstracyjnym endpointem API                                   |
| Logowanie i wylogowanie                     | Połączone z API                                                              |
| Sesja użytkownika                           | Automatyczne przywracanie i odświeżanie sesji oraz ponawianie żądań po `401` |
| Rejestracja                                 | Połączona z API                                                              |
| Dane osobowe i adres w profilu              | Pobierane i zapisywane przez API                                             |
| Zmiana adresu e-mail i hasła w profilu      | Obsługiwana wyłącznie po stronie interfejsu                                  |
| Ulubione                                    | Połączone z API i zapisywane w bazie danych                                  |
| Punkty lojalnościowe                        | Połączone z demonstracyjnymi endpointami API                                 |
| Historia zamówień                           | Połączona z API i pobierana z bazy danych                                    |
| Koszyk                                      | Połączony z API i zapisywany w bazie danych                                  |
| Kody promocyjne                             | Walidowane przez demonstracyjny endpoint API                                 |
| Składanie zamówień i płatności              | Widoki są gotowe, finalizacja nie jest jeszcze podłączona                    |
| Resetowanie hasła                           | Połączone z API                                                              |

## Technologie

- React 19;
- TypeScript 6;
- Vite 8;
- React Router;
- Tailwind CSS;
- `openapi-fetch`;
- `openapi-typescript`;
- Motion;
- Lucide React;
- React Datepicker;
- Oxlint;
- Oxfmt.

## Integracja z backendem

Aplikacja komunikuje się z REST API SportRent. Klient w `src/api` korzysta
z typów generowanych na podstawie dokumentu OpenAPI udostępnianego przez
backend FastAPI. Pozwala to wykrywać rozbieżności kontraktu API podczas
sprawdzania typów i budowania aplikacji.

Adres API jest pobierany ze zmiennej środowiskowej `VITE_API_URL`. Żądania są
wysyłane z opcją `credentials: include`, dzięki czemu przeglądarka może
obsługiwać ciasteczka sesyjne backendu.

Stan uwierzytelnienia jest zarządzany przez `AuthProvider`. Token dostępu jest
przechowywany wyłącznie w pamięci aplikacji i automatycznie dodawany do żądań
API. Po uruchomieniu frontend próbuje przywrócić sesję za pomocą ciasteczka
odświeżającego. Wygaśnięcie tokenu dostępu powoduje próbę jego odnowienia
i ponowienie pierwotnego żądania. Operacje zmieniające stan sesji korzystają
również z nagłówka CSRF.

## Wymagania

- Node.js 22;
- pnpm;
- uruchomiony backend SportRent.

## Uruchomienie lokalne

Skopiuj przykładową konfigurację i zainstaluj zależności:

```bash
cp .env.example .env
pnpm install
```

Domyślna konfiguracja wskazuje lokalny backend:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
VITE_DEV_HOST=127.0.0.1
VITE_DEV_PORT=5173
```

Uruchom backend zgodnie z instrukcją w jego repozytorium, a następnie uruchom
frontend:

```bash
pnpm dev
```

Przy ustawieniach z `.env.example` aplikacja będzie dostępna pod adresem
`http://127.0.0.1:5173`. Host i port serwera deweloperskiego można zmienić za
pomocą `VITE_DEV_HOST` i `VITE_DEV_PORT`.

Jeżeli używany jest inny adres frontendu, musi on zostać dodany do listy
dozwolonych źródeł CORS (`ALLOWED_ORIGINS`) po stronie backendu.

## Synchronizacja typów API

Po zmianie endpointów lub schematów backendu uruchom API, a następnie wykonaj:

```bash
pnpm api:generate
```

Polecenie pobiera dokument `openapi.json` z adresu ustawionego w
`VITE_API_URL` i aktualizuje plik `src/api/generated/schema.ts`.
Wygenerowanego pliku nie należy edytować ręcznie.

## Dostępne skrypty

| Polecenie           | Działanie                                      |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Uruchamia serwer deweloperski                  |
| `pnpm build`        | Sprawdza typy i tworzy build produkcyjny       |
| `pnpm preview`      | Uruchamia lokalny podgląd buildu               |
| `pnpm lint`         | Analizuje kod za pomocą Oxlint                 |
| `pnpm type-check`   | Sprawdza typy TypeScript                       |
| `pnpm format`       | Formatuje pliki źródłowe                       |
| `pnpm format-check` | Sprawdza formatowanie bez modyfikowania plików |
| `pnpm api:generate` | Generuje typy TypeScript z OpenAPI backendu    |

Przed wysłaniem zmian warto wykonać:

```bash
pnpm lint
pnpm type-check
pnpm format-check
pnpm build
```

## Struktura frontendu

```text
.
├── scripts/              # skrypty narzędziowe, w tym generowanie typów API
└── src/
    ├── api/              # typowany klient REST API
    ├── assets/           # obrazy, ikony i materiały statyczne
    ├── components/       # komponenty współdzielone
    ├── features/         # logika poszczególnych obszarów aplikacji
    ├── hooks/            # współdzielone hooki React
    ├── layouts/          # układy stron
    ├── pages/            # strony i routing aplikacji
    ├── styles/           # konfiguracja warstwy wizualnej
    ├── types/            # współdzielone typy TypeScript
    └── utils/            # funkcje pomocnicze
```

## Licencja

Projekt jest udostępniany na licencji Apache License 2.0. Pełne warunki
znajdują się w pliku [LICENSE](LICENSE).
