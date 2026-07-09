import ContentPanel from '../ContentPanel.tsx';
import ButtonCore from '../core/ButtonCore.tsx';

type EmptyCartPanelProps = {
  onGoToOffer: () => void;
};

export default function EmptyCartPanel({ onGoToOffer }: EmptyCartPanelProps) {
  return (
    <ContentPanel className="mx-8 mt-12 text-center">
      <p className="text-3xl font-semibold text-slate-950">Twój koszyk jest pusty</p>
      <p className="mt-3 max-w-xl text-lg text-slate-700">
        Wybierz sprzęt, który chcesz wypożyczyć, dodaj terminy rezerwacji i wróć tutaj, aby
        sfinalizować zamówienie.
      </p>
      <ButtonCore
        text="Przejdź do oferty"
        onClick={onGoToOffer}
        className="mt-6 rounded-lg bg-slate-800 px-8 py-3 text-lg font-semibold text-white transition-colors"
      />
    </ContentPanel>
  );
}
