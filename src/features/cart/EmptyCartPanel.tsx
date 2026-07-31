import ButtonCore from '../../components/core/ButtonCore.tsx';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import SectionTitle from '../../components/core/SectionTitle.tsx';

type EmptyCartPanelProps = {
  onGoToOffer: () => void;
};

export default function EmptyCartPanel({ onGoToOffer }: EmptyCartPanelProps) {
  return (
    <ContentPanel className="mx-8 text-center">
      <SectionTitle>Twój koszyk jest pusty</SectionTitle>
      <p className="mt-3 max-w-xl text-lg text-app-textMuted">
        Wybierz sprzęt, który chcesz wypożyczyć, dodaj terminy rezerwacji i wróć tutaj, aby
        sfinalizować zamówienie.
      </p>
      <ButtonCore
        text="Przejdź do oferty"
        onClick={onGoToOffer}
        className="mt-6 px-8 py-3 text-lg font-semibold transition-colors"
      />
    </ContentPanel>
  );
}
