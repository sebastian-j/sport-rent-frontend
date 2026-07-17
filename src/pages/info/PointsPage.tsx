import { Coins, Gift, ShoppingBag } from 'lucide-react';
import {
  PLN_SPENT_PER_POINT_EARNED,
  POINTS_REQUIRED_PER_PLN,
} from '../../features/loyalty/constants.ts';

const EXAMPLE_ORDER_TOTAL_IN_PLN = 129;
const EXAMPLE_REWARD_COST_IN_PLN = 75;

export default function PointsPage() {
  const pointsEarnedForExample = Math.floor(
    EXAMPLE_ORDER_TOTAL_IN_PLN / PLN_SPENT_PER_POINT_EARNED
  );
  const pointsRequiredForExample = EXAMPLE_REWARD_COST_IN_PLN * POINTS_REQUIRED_PER_PLN;

  return (
    <article>
      <header>
        <h1>Program lojalnościowy</h1>
        <p>
          Każde zamówienie przybliża Cię do kolejnego wypożyczenia. Zbieraj punkty podczas zakupów,
          a gdy zgromadzisz ich wystarczająco dużo, opłać nimi całe zamówienie.
        </p>
      </header>

      <section>
        <h2>Proste zasady, więcej przygód</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-app-surfaceSoft p-6 sm:p-8">
            <Coins className="mb-4" aria-hidden="true" />
            <h3>Zdobywaj punkty</h3>
            <p className="mt-3 text-app-textMuted">
              Za każde wydane {PLN_SPENT_PER_POINT_EARNED} zł otrzymujesz 1 punkt. Wynik zawsze
              zaokrąglamy w dół do pełnego punktu.
            </p>
          </div>

          <div className="rounded-xl bg-app-surfaceSoft p-6 sm:p-8">
            <Gift className="mb-4" aria-hidden="true" />
            <h3>Płać punktami</h3>
            <p className="mt-3 text-app-textMuted">
              Każda złotówka wartości zamówienia wymaga {POINTS_REQUIRED_PER_PLN} punktów. Jeśli
              masz odpowiednie saldo, możesz wykorzystać punkty do opłacenia zamówienia.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Jak naliczamy punkty?</h2>
        <div className="grid gap-6 rounded-2xl bg-app-surfaceStrong p-6 text-app-textInverted md:grid-cols-[auto_1fr] sm:p-8">
          <ShoppingBag className="h-10 w-10" aria-hidden="true" />
          <div>
            <h3>Przykładowe zamówienie za {EXAMPLE_ORDER_TOTAL_IN_PLN} zł</h3>
            <p className="mt-3 text-app-textInvertedMuted">
              {EXAMPLE_ORDER_TOTAL_IN_PLN} zł ÷ {PLN_SPENT_PER_POINT_EARNED} zł ={' '}
              {pointsEarnedForExample} pełnych punktów. Jeśli wartość zamówienia zawiera grosze,
              naliczamy wyłącznie pełne punkty.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Ile punktów kosztuje zamówienie?</h2>
        <p>
          Cenę zamówienia w złotych mnożymy przez {POINTS_REQUIRED_PER_PLN}. Zamówienie o wartości{' '}
          {EXAMPLE_REWARD_COST_IN_PLN} zł wymaga więc:
        </p>
        <div className="inline-flex w-fit max-w-full flex-wrap rounded-xl bg-app-surfaceSoft px-6 py-4 text-2xl font-semibold">
          {EXAMPLE_REWARD_COST_IN_PLN} zł × {POINTS_REQUIRED_PER_PLN} = {pointsRequiredForExample}{' '}
          punktów
        </div>
      </section>

      <section>
        <h2>W skrócie</h2>
        <ul>
          <li>
            Zdobyte punkty = wartość zamówienia ÷ {PLN_SPENT_PER_POINT_EARNED}, z zaokrągleniem w
            dół.
          </li>
          <li>Punkty potrzebne do zapłaty = wartość zamówienia × {POINTS_REQUIRED_PER_PLN}.</li>
          <li>Zamówienie można opłacić punktami po zgromadzeniu wymaganego salda.</li>
        </ul>
      </section>
    </article>
  );
}
