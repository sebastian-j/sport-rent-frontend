type FormActionsProps = {
  submitLabel: string;
  onCancel: () => void;
};

export default function FormActions({ submitLabel, onCancel }: FormActionsProps) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="submit"
        className="rounded-lg bg-app-surfaceStrong px-6 py-2 text-app-textInverted transition-colors hover:bg-app-surfaceStrong/90"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-4 py-2 text-app-textMuted hover:bg-app-surfaceNeutral"
      >
        Anuluj
      </button>
    </div>
  );
}
