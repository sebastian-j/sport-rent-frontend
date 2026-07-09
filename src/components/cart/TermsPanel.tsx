import { forwardRef } from 'react';
import { Badge, BadgeCheck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import ContentPanel from '../ContentPanel.tsx';

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
      className={twMerge(
        'mx-8 mt-12 flex-[2] flex-row flex-wrap justify-between transition-colors duration-200',
        highlighted && 'border-red-600 bg-red-200'
      )}
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
          <BadgeCheck size={32} className="text-green-600" />
        ) : (
          <Badge size={32} className="text-red-600" />
        )}
      </div>
    </ContentPanel>
  );
});

export default TermsPanel;
