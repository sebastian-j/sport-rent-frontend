import { forwardRef } from 'react';
import { Badge, BadgeCheck } from 'lucide-react';
import ContentPanel from '../../components/core/ContentPanel.tsx';

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
      className="mx-8 mt-12 flex-[2] flex-row flex-wrap justify-between transition-colors duration-200"
      ref={ref}
    >
      <p className="text-2xl">
        Przeczytaj{' '}
        <a
          className="font-semibold underline"
          href="https://dok.agh.edu.pl/doc.php?id=17184"
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
          <Badge size={32} className="text-app-danger" />
        )}
      </div>
    </ContentPanel>
  );
});

export default TermsPanel;
