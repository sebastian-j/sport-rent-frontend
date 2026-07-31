type FormActionsProps = {
  submitLabel: string;
  onCancel: () => void;
  disabled?: boolean;
};

export default function FormActions({ submitLabel, onCancel, disabled = false }: FormActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-app-surfaceStrong px-6 py-2 text-white transition-colors hover:bg-app-surfaceStrong/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="rounded-lg px-4 py-2 text-app-textMuted hover:bg-app-surfaceNeutral disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anuluj
      </button>
    </div>
  );
}
