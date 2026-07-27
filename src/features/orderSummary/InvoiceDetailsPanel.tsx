import { Pencil } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useId, useState } from 'react';

import type { InvoiceDetails } from '../userDetails/userDetailsTypes.ts';
import InvoiceDetailsForm from './InvoiceDetailsForm.tsx';
import InvoiceDetailsView from './InvoiceDetailsView.tsx';

type InvoiceDetailsPanelProps = {
  enabled: boolean;
  details: InvoiceDetails;
  onEnabledChange: (enabled: boolean) => void;
  onDetailsChange: (details: InvoiceDetails) => void;
};

export default function InvoiceDetailsPanel({
  enabled,
  details,
  onEnabledChange,
  onDetailsChange,
}: InvoiceDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const contentId = useId();
  const prefersReducedMotion = useReducedMotion();

  const handleEnabledChange = (nextEnabled: boolean) => {
    onEnabledChange(nextEnabled);
    setIsEditing(nextEnabled);
  };

  const handleSave = (updatedDetails: InvoiceDetails) => {
    onDetailsChange(updatedDetails);
    setIsEditing(false);
  };

  return (
    <section className="w-full">
      <label className="flex w-full cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          aria-controls={contentId}
          aria-expanded={enabled}
          onChange={(event) => handleEnabledChange(event.currentTarget.checked)}
          className="h-5 w-5 shrink-0 cursor-pointer accent-app-surfaceStrong"
        />
        <span className="text-sm font-medium text-app-textStrong sm:text-base">
          Poproszę o fakturę
        </span>
      </label>

      <AnimatePresence initial={false}>
        {enabled && (
          <motion.div
            key="invoice-details"
            id={contentId}
            className="overflow-hidden"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="mt-6 flex flex-col items-center gap-6 border-t border-app-borderSoft pt-6">
              <div className="relative flex w-full items-center justify-center px-12 sm:px-16 md:px-12 lg:px-16">
                <h2 className="min-w-0 text-center text-2xl font-semibold leading-tight text-app-textStrong">
                  Dane do faktury
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edytuj dane do faktury"
                    className="absolute right-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm text-app-textMuted transition-colors hover:bg-app-surfaceNeutral hover:text-app-text sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 md:h-10 md:w-10 md:gap-0 md:p-0 lg:h-auto lg:w-auto lg:gap-2 lg:px-3 lg:py-2"
                  >
                    <Pencil size={17} />
                    <span className="hidden sm:inline md:hidden lg:inline">Edytuj</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <InvoiceDetailsForm
                  initialDetails={details}
                  onSave={handleSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <InvoiceDetailsView details={details} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
