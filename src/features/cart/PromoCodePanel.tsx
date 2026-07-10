import ButtonCore from '../../components/core/ButtonCore.tsx';
import ContentPanel from '../../components/core/ContentPanel.tsx';

type PromoCodePanelProps = {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
};

export default function PromoCodePanel({ promoCode, onPromoCodeChange }: PromoCodePanelProps) {
  return (
    <ContentPanel className="mx-8 mt-12">
      <p className="text-2xl">Kod promocyjny</p>
      <input
        type="text"
        value={promoCode}
        onChange={(event) => onPromoCodeChange(event.currentTarget.value)}
        placeholder="Wpisz kod"
        className="mt-4 h-14 w-full rounded-lg border-2 border-app-border bg-app-surface px-4 text-xl text-app-text outline-none transition-colors placeholder:text-app-textMuted focus:border-app-border"
      />
      <ButtonCore
        text="Sprawdź"
        className="mt-4 flex h-14 w-full items-center justify-center text-2xl"
      />
    </ContentPanel>
  );
}
