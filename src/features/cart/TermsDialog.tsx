import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import ButtonCore from '../../components/core/ButtonCore.tsx';
import DocumentPanel from '../../components/core/DocumentPanel.tsx';
import { TermsContent } from '../../pages/document/TermsPage.tsx';

type TermsDialogProps = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
};

export default function TermsDialog({ open, onClose, onAccept }: TermsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  const updateHasReachedEnd = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    const remainingScroll = content.scrollHeight - content.scrollTop - content.clientHeight;
    setHasReachedEnd(remainingScroll <= 4);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setHasReachedEnd(false);
      dialog.showModal();
      const animationFrame = window.requestAnimationFrame(updateHasReachedEnd);
      return () => window.cancelAnimationFrame(animationFrame);
    }

    if (!open && dialog.open) dialog.close();
  }, [open, updateHasReachedEnd]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Regulamin wypożyczalni"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto h-[min(92vh,60rem)] w-[min(94vw,64rem)] overflow-hidden rounded-2xl border border-app-borderSoft bg-app-surface p-0 text-app-text shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex h-full flex-col">
        <div className="flex justify-end border-b border-app-borderSoft p-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij regulamin"
            className="flex h-10 w-10 items-center justify-center rounded-full text-app-text transition-colors hover:bg-app-surfaceSoft"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <div
          ref={contentRef}
          onScroll={updateHasReachedEnd}
          className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-6"
        >
          <DocumentPanel>
            <TermsContent />
          </DocumentPanel>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-app-borderSoft bg-app-surface p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-3 font-semibold text-app-text hover:bg-app-surfaceSoft"
          >
            Zamknij
          </button>
          <ButtonCore
            disabled={!hasReachedEnd}
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="px-5 py-3"
          >
            {hasReachedEnd ? 'Zapoznałem się z regulaminem' : 'Przewiń regulamin do końca'}
          </ButtonCore>
        </div>
      </div>
    </dialog>
  );
}
