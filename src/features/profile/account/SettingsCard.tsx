import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={cardRef} className="scroll-mt-36 bg-app-surfaceElevated md:scroll-mt-16">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={onToggle}
        className="flex w-full select-none items-center justify-between gap-4 p-4 text-left transition-colors [@media(hover:hover)]:hover:bg-app-surfaceSoft/50 md:p-6"
      >
        <span>
          <span className="block text-lg font-bold">{title}</span>
          <span className="mt-1 block text-sm text-app-textMuted">{subtitle}</span>
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
          }
          className="shrink-0 text-app-textMuted"
        >
          <ChevronRight aria-hidden="true" className="shrink-0 text-app-textMuted" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="settings-content"
            id={contentId}
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2, ease: 'easeOut' },
                  }
            }
            className="overflow-hidden"
          >
            <div className="border-t border-app-borderSoft p-4 pt-0 md:p-6 md:pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
