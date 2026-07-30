import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type AuthNoticeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: 'error' | 'info' | 'success';
};

const noticeStyles = {
  error: {
    icon: AlertCircle,
    className: 'border-app-danger/30 bg-app-dangerSoft/45 text-app-danger',
  },
  info: {
    icon: Info,
    className: 'border-app-borderSoft bg-app-surfaceSoft/70 text-app-text',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-app-success/30 bg-app-success/10 text-app-success',
  },
} as const;

export default function AuthNotice({
  children,
  tone = 'info',
  className,
  ...props
}: AuthNoticeProps) {
  const notice = noticeStyles[tone];
  const Icon = notice.icon;

  return (
    <div
      {...props}
      className={twMerge(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6',
        notice.className,
        className
      )}
    >
      <Icon aria-hidden="true" size={19} className="mt-0.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
