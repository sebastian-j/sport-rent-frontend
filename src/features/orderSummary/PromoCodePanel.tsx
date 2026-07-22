import { X } from 'lucide-react';

import ButtonCore from '../../components/core/ButtonCore.tsx';

type PromoCodePanelProps = {
  promoCode: string;
  appliedCode?: string;
  error?: string;
  onPromoCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
};

export default function PromoCodePanel({
  promoCode,
  appliedCode,
  error,
  onPromoCodeChange,
  onApply,
  onRemove,
}: PromoCodePanelProps) {
  return (
    <div className="flex w-full flex-col border-t border-app-borderSoft pt-5">
      <p className="text-center text-lg font-semibold text-app-textStrong">Kod promocyjny</p>

      {appliedCode ? (
        <div className="mt-3 flex w-full items-center justify-between gap-3 rounded-lg border border-app-success bg-app-surface px-3 py-2">
          <p role="status" className="min-w-0 text-sm text-app-textMuted">
            Wykorzystano kod: <strong className="text-app-textStrong">{appliedCode}</strong>
          </p>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Usuń kod promocyjny ${appliedCode}`}
            className="shrink-0 rounded-md p-1 text-app-textMuted transition-colors hover:bg-app-surfaceSoft hover:text-app-danger"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={promoCode}
            onChange={(event) => onPromoCodeChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onApply();
              }
            }}
            placeholder="np. SPORT10"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'promo-code-error' : undefined}
            className={`mt-3 h-12 w-full rounded-lg border-2 bg-app-surface px-3 text-base text-app-text outline-none transition-colors placeholder:text-app-textMuted ${
              error
                ? 'border-app-danger focus:border-app-danger'
                : 'border-app-border focus:border-app-border'
            }`}
          />
          {error && (
            <p id="promo-code-error" role="alert" className="mt-1 text-sm text-app-danger">
              {error}
            </p>
          )}
          <ButtonCore
            text="Sprawdź"
            onClick={onApply}
            className="mt-3 flex h-12 w-full items-center justify-center text-lg"
          />
        </>
      )}
    </div>
  );
}
