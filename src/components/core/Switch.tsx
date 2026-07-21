type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
  disabled?: boolean;
};

export default function Switch({
  checked,
  onCheckedChange,
  ariaLabel,
  disabled = false,
}: SwitchProps) {
  return (
    <span className="relative inline-flex h-6 w-11 shrink-0">
      <input
        type="checkbox"
        role="switch"
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
      />
      <span className="pointer-events-none h-full w-full rounded-full border border-app-borderSoft bg-app-surfaceSoft transition-colors peer-checked:bg-app-text peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-app-text after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-app-textMuted after:shadow-sm after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:bg-app-surfaceElevated dark:after:bg-app-text dark:peer-checked:after:bg-app-surfaceElevated" />
    </span>
  );
}
