import ButtonCore from '../../components/core/ButtonCore.tsx';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import SectionTitle from '../../components/core/SectionTitle.tsx';
import { formatPrice } from '../../utils/formatPrice.ts';
import type { OrderInformation } from './cartTypes.ts';

type CartSummaryPanelProps = {
  orderInformation: OrderInformation;
  onBuy: () => void;
  disabled?: boolean;
};

export default function CartSummaryPanel({
  orderInformation,
  onBuy,
  disabled = false,
}: CartSummaryPanelProps) {
  return (
    <ContentPanel className="mx-8 mt-12 flex-[2] items-center gap-2 text-center lg:items-stretch lg:text-left">
      <SectionTitle className="text-app-text">Podsumowanie zamówienia</SectionTitle>
      <p className="text-xl">Wartość koszyka: {formatPrice(orderInformation.totalValue)}</p>
      <p className="text-xl">Liczba produktów: {orderInformation.totalQuantity}</p>

      <ButtonCore
        text="Kup teraz"
        onClick={onBuy}
        disabled={disabled}
        className="mt-4 flex h-16 w-full items-center justify-center text-2xl"
      />
    </ContentPanel>
  );
}
