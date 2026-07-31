import { Badge, BadgeCheck } from 'lucide-react';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import ContentPanel from '../../components/core/ContentPanel.tsx';
import { DOCUMENT_ROUTES } from '../../routes.ts';

type TermsPanelProps = {
  readTerms: boolean;
  highlighted: boolean;
  onReadTerms: () => void;
};

const TermsPanel = forwardRef<HTMLDivElement, TermsPanelProps>(function TermsPanel(
  { readTerms, highlighted, onReadTerms },
  ref
) {
  return (
    <ContentPanel
      tone={highlighted ? 'danger' : 'default'}
      className="mx-8 mt-12 flex-[2] flex-col items-center gap-4 text-center transition-colors duration-200 lg:flex-row lg:justify-between lg:text-left"
      ref={ref}
    >
      <p className="text-2xl">
        Przeczytaj{' '}
        <Link
          className="font-semibold underline"
          to={DOCUMENT_ROUTES.terms}
          target="_blank"
          onClick={onReadTerms}
        >
          Regulamin
        </Link>
        , aby dokonać zakupu.
      </p>
      <div>
        {readTerms ? (
          <BadgeCheck size={32} className="text-app-success" />
        ) : (
          <Link
            to={DOCUMENT_ROUTES.terms}
            target="_blank"
            onClick={onReadTerms}
            aria-label="Otwórz regulamin w nowej karcie"
            className="inline-flex text-app-danger"
          >
            <Badge size={32} aria-hidden="true" />
          </Link>
        )}
      </div>
    </ContentPanel>
  );
});

export default TermsPanel;
