import { forwardRef, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { componentStyles, type ContentPanelTone } from './componentStyles.ts';

type ContentPanelProps = {
  children: ReactNode;
  tone?: ContentPanelTone;
  className?: string;
};

const ContentPanel = forwardRef<HTMLDivElement, ContentPanelProps>(function ContentPanel(
  { children, tone = 'default', className },
  ref
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        componentStyles.contentPanel.base,
        componentStyles.contentPanel.tone[tone],
        className
      )}
    >
      {children}
    </div>
  );
});

export default ContentPanel;
