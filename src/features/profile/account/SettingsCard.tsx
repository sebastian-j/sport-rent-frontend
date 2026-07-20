import { ChevronDown, ChevronRight } from 'lucide-react';
import { type ReactNode, useId } from 'react';
import { useDisclosureScroll } from '../useDisclosureScroll.ts';

type SettingsCardProps = {
  title: string;
  subtitle: string;
  isExpanded: boolean;
  scrollOnCollapse: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function SettingsCard({
  title,
  subtitle,
  isExpanded,
  scrollOnCollapse,
  onToggle,
  children,
}: SettingsCardProps) {
  const cardRef = useDisclosureScroll(isExpanded, { scrollOnCollapse });
  const contentId = useId();

  return (
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated min-[961px]:scroll-mt-16">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full select-none items-center justify-between gap-4 p-4 text-left transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 min-[961px]:p-6"
      >
        <span>
          <span className="block text-lg font-bold">{title}</span>
          <span className="mt-1 block text-sm text-app-textMuted">{subtitle}</span>
        </span>
        {isExpanded ? (
          <ChevronDown aria-hidden="true" className="shrink-0 text-app-textMuted" />
        ) : (
          <ChevronRight aria-hidden="true" className="shrink-0 text-app-textMuted" />
        )}
      </button>
      {isExpanded && (
        <div
          id={contentId}
          className="border-t border-app-borderSoft p-4 pt-0 min-[961px]:p-6 min-[961px]:pt-0"
        >
          {children}
        </div>
      )}
    </div>
  );
}
