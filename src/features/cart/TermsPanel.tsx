import { Badge, BadgeCheck } from 'lucide-react';
import { forwardRef, useState } from 'react';

import ContentPanel from '../../components/core/ContentPanel.tsx';
import TermsDialog from './TermsDialog.tsx';

type TermsPanelProps = {
  readTerms: boolean;
  highlighted: boolean;
  onReadTerms: () => void;
};

const TermsPanel = forwardRef<HTMLDivElement, TermsPanelProps>(function TermsPanel(
  { readTerms, highlighted, onReadTerms },
  ref
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <ContentPanel
        tone={highlighted ? 'danger' : 'default'}
        className="mx-8 mt-12 flex-[2] flex-col items-center gap-4 text-center transition-colors duration-200 lg:flex-row lg:justify-between lg:text-left"
        ref={ref}
      >
        <p className="text-2xl">
          Przeczytaj{' '}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => setIsDialogOpen(true)}
          >
            regulamin
          </button>
          , aby dokonać zakupu.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Otwórz regulamin"
            className={`inline-flex ${readTerms ? 'text-app-success' : 'text-app-danger'}`}
          >
            {readTerms ? (
              <BadgeCheck size={32} aria-hidden="true" />
            ) : (
              <Badge size={32} aria-hidden="true" />
            )}
          </button>
        </div>
      </ContentPanel>

      <TermsDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAccept={onReadTerms}
      />
    </>
  );
});

export default TermsPanel;
