import ButtonCore from '../../components/core/ButtonCore.tsx';

type PromoCodePanelProps = {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
};

export default function PromoCodePanel({ promoCode, onPromoCodeChange }: PromoCodePanelProps) {
  return (
    <div className="flex w-full flex-col border-t border-app-borderSoft pt-5">
      <p className="text-center text-lg font-semibold text-app-textStrong">Kod promocyjny</p>
      <input
        type="text"
        value={promoCode}
        onChange={(event) => onPromoCodeChange(event.currentTarget.value)}
        placeholder="Wpisz kod"
        className="mt-3 h-12 w-full rounded-lg border-2 border-app-border bg-app-surface px-3 text-base text-app-text outline-none transition-colors placeholder:text-app-textMuted focus:border-app-border"
      />
      <ButtonCore
        text="Sprawdź"
        className="mt-3 flex h-12 w-full items-center justify-center text-lg"
      />
    </div>
  );
}
