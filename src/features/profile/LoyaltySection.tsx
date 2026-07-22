import PointsCard from './loyalty/PointsCard.tsx';

import { getLoyaltyHistory, type LoyaltyHistoryItem } from '../../api/loyalty.ts';
import { useEffect, useState } from 'react';

export default function LoyaltySection() {
  const [items, setItems] = useState<LoyaltyHistoryItem[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function loadHistory() {
      const { data, error } = await getLoyaltyHistory();

      if (error) {
        console.error(error);
        return;
      }
      setItems(data.items.toSorted((a, b) => b.created_at.localeCompare(a.created_at)));
      setBalance(data.balance);
    }
    void loadHistory();
  }, []);

  return (
    <section className="flex w-full flex-col items-center justify-center pt-6 text-app-text [container-type:inline-size] lg:pt-12">
      <p className="w-full text-center text-[clamp(1.875rem,8cqi,3rem)] leading-tight">
        Program lojalnościowy
      </p>
      <p className="mt-4 w-full text-center text-[clamp(1.25rem,5cqi,1.875rem)] leading-tight">
        Posiadasz <span className="font-semibold">{balance}</span> punktów
      </p>
      <div className="mx-auto my-6 flex w-full flex-col divide-y divide-app-borderSoft overflow-hidden rounded-xl border border-app-border lg:my-12 lg:w-[calc(100%-6rem)]">
        {items.map((acquisition) => (
          <PointsCard
            key={acquisition.id}
            date={new Date(acquisition.created_at).getTime()}
            amount={acquisition.amount}
          />
        ))}
      </div>
    </section>
  );
}
