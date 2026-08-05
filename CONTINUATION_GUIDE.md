# Kontynuacja projektu SportRent

Projekt składa się z dwóch repozytoriów: `sport-rent-frontend` oraz `sport-rent-backend`.

## Zmiany w bazie danych i migracje

Po zmianie modeli bazy należy przygotować i sprawdzić migrację Alembic. Jeśli
po połączeniu gałęzi polecenie Alembic zgłasza **multiple heads**, oznacza to,
że graf migracji rozdzielił się w pewnym miejscu, zwykle dlatego, że dwie
gałęzie niezależnie dodały migracje.

W katalogu backendu należy wtedy wykonać:

```bash
uv run alembic merge heads -m "Merge multiple heads"
```

Tworzy to nową migrację, której rodzicami są wszystkie aktualne heads, dzięki
czemu graf ponownie ma jeden koniec. Nie scala ono automatycznie sprzecznych
zmian w tabelach — treść i kolejność wcześniejszych migracji trzeba sprawdzić
ręcznie. Nowy plik migracji należy dodać do repozytorium.

Do odtworzenia lokalnej bazy od zera służy:

```bash
uv run --env-file .env python -m scripts.reset_database
```

`reset_database` usuwa cały schemat wraz z danymi, tworzy go ponownie,
wykonuje wszystkie migracje do `head`, a następnie seeduje bazę. Skrypt
prosi o wpisanie nazwy docelowej bazy; opcja `--yes` pomija to zabezpieczenie.
Polecenia należy używać wyłącznie dla lokalnej bazy deweloperskiej, gdy po
zmianach tabel, migracji lub seedów potrzebny jest czysty, spójny stan.

## Synchronizacja API z frontendem

Po zmianie endpointów albo schematów odpowiedzi backendu należy uruchomić
backend i w katalogu frontendu wykonać:

```bash
pnpm api:generate
```

Skrypt pobiera `/openapi.json` z adresu `VITE_API_URL` zapisanego w `.env` i
generuje `src/api/generated/schema.ts`. Dzięki temu frontend korzysta z typów
wynikających z aktualnego kontraktu backendu. Plik należy dodać do zmian.

## Co sprawdza CI frontendu

CI uruchamia się dla pull requestów oraz zmian wypchniętych do `main` i wykonuje:

- **TypeScript check** - sprawdza typy bez generowania buildu;
- **Format check** - sprawdza zgodność formatowania z Oxfmt;
- **Lint check** - wykrywa problemy jakościowe za pomocą Oxlint;
- **Build check** - ponownie kompiluje TypeScript i tworzy produkcyjny build Vite,
  wykrywając błędy integracji oraz bundlowania.

## Co sprawdza CI backendu

CI backendu uruchamia PostgreSQL, instaluje zależności z pliku blokady, a potem
wykonuje kolejno:

- **Lint** - sprawdza błędy i reguły jakości kodu;
- **Format check** - sprawdza formatowanie bez zmian;
- **Apply migrations** - buduje schemat pustej bazy ze wszystkich migracji;
- **Model and migration consistency** - sprawdza, czy modele SQLAlchemy nie zawierają
  zmian wymagających brakującej migracji;
- **Tests** - uruchamia testy jednostkowe i integracyjne;
- **Migration downgrade** - cofa wszystkie migracje i weryfikuje, czy ich funkcje
  `downgrade()` działają.
