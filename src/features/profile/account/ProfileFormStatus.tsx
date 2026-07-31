import { twMerge } from 'tailwind-merge';

export type ProfileFormStatusTone = 'error' | 'pending' | 'success';

type ProfileFormStatusProps = {
  message: string;
  tone: ProfileFormStatusTone;
};

const toneClassNames: Record<ProfileFormStatusTone, string> = {
  error: 'text-app-danger',
  pending: 'text-app-textMuted',
  success: 'text-app-success',
};

export default function ProfileFormStatus({ message, tone }: ProfileFormStatusProps) {
  return (
    <p role="status" aria-live="polite" className={twMerge('mt-4 text-sm', toneClassNames[tone])}>
      {message}
    </p>
  );
}
