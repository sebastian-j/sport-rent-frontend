import { Badge, BadgeCheck } from 'lucide-react';
import { forwardRef } from 'react';

import ContentPanel from '../../components/core/ContentPanel.tsx';

const TOS_URL = 'https://dok.agh.edu.pl/doc.php?id=17184';

type TermsPanelProps = {
  readTos: boolean;
  highlighted: boolean;
  onReadTos: () => void;
};

const TermsPanel = forwardRef<HTMLDivElement, TermsPanelProps>(function TermsPanel(
  { readTos, highlighted, onReadTos },
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
        <a
          className="font-semibold underline"
          href={TOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onReadTos}
        >
          Regulamin
        </a>
        , aby dokonać zakupu.
      </p>
      <div>
        {readTos ? (
          <BadgeCheck size={32} className="text-app-success" />
        ) : (
          <a
            href={TOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onReadTos}
            aria-label="Otwórz regulamin w nowej karcie"
            className="inline-flex text-app-danger"
          >
            <Badge size={32} aria-hidden="true" />
          </a>
        )}
      </div>
    </ContentPanel>
  );
});

export default TermsPanel;
