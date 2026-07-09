import ContentPanel from '../../components/core/ContentPanel.tsx';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import { formatPrice } from '../../utils/formatPrice.ts';
import type { OrderInformation } from './cartTypes.ts';

type CartSummaryPanelProps = {
  orderInformation: OrderInformation;
  onBuy: () => void;
};

export default function CartSummaryPanel({ orderInformation, onBuy }: CartSummaryPanelProps) {
  return (
    <ContentPanel className="mx-8 mt-12 flex-[2] gap-2">
      <p className="text-3xl">Podsumowanie zamówienia</p>
      <p className="text-xl">Wartość koszyka: {formatPrice(orderInformation.totalValue)}</p>
      <p className="text-xl">Liczba produktów: {orderInformation.totalQuantity}</p>

      <ButtonCore
        text="Kup teraz"
        onClick={onBuy}
        className="mt-4 flex h-16 w-full items-center justify-center text-2xl"
      />
    </ContentPanel>
  );
}
