import { forwardRef, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ContentPanelProps = {
  children: ReactNode;
  className?: string;
};

const ContentPanel = forwardRef<HTMLDivElement, ContentPanelProps>(function ContentPanel(
  { children, className },
  ref
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-1 flex-col items-center rounded-xl border-[1px] border-slate-950 bg-slate-200 p-8',
        className
      )}
    >
      {children}
    </div>
  );
});

export default ContentPanel;
