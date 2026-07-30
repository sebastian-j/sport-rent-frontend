import { type SubmitEvent, useState } from 'react';

import { changePassword } from '../../../api/auth.ts';
import FormActions from './FormActions.tsx';
import ProfileFormInput from './ProfileFormInput.tsx';
import ProfileFormStatus, { type ProfileFormStatusTone } from './ProfileFormStatus.tsx';

type PasswordFormProps = {
  onCancel: () => void;
};

type PasswordStatus = {
  message: string;
  tone: ProfileFormStatusTone;
};

export default function PasswordForm({ onCancel }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [status, setStatus] = useState<PasswordStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (newPassword.length < 8 || newPassword.length > 128) {
      setStatus({
        tone: 'error',
        message: 'Nowe hasło musi mieć od 8 do 128 znaków.',
      });
      return;
    }

    if (newPassword !== confirmedPassword) {
      setStatus({
        tone: 'error',
        message: 'Nowe hasła nie są identyczne.',
      });
      return;
    }

    if (currentPassword === newPassword) {
      setStatus({
        tone: 'error',
        message: 'Nowe hasło musi różnić się od aktualnego.',
      });
      return;
    }

    setStatus({
      tone: 'pending',
      message: 'Aktualizowanie hasła...',
    });
    setIsSubmitting(true);

    try {
      const result = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (result.error) {
        if (result.response.status === 401) {
          setStatus({
            tone: 'error',
            message: 'Aktualne hasło jest nieprawidłowe.',
          });
          return;
        }

        setStatus({
          tone: 'error',
          message: 'Nie udało się zmienić hasła. Spróbuj ponownie.',
        });
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmedPassword('');
      setStatus({
        tone: 'success',
        message: 'Hasło zostało zaktualizowane.',
      });
    } catch {
      setStatus({
        tone: 'error',
        message: 'Nie udało się połączyć z serwerem. Sprawdź połączenie i spróbuj ponownie.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <div className="mt-4 space-y-4">
          <ProfileFormInput
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              setStatus(null);
            }}
            placeholder="Obecne hasło"
            autoComplete="current-password"
            required
          />
          <ProfileFormInput
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              setStatus(null);
            }}
            placeholder="Nowe hasło"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
          <ProfileFormInput
            type="password"
            value={confirmedPassword}
            onChange={(event) => {
              setConfirmedPassword(event.target.value);
              setStatus(null);
            }}
            placeholder="Powtórz nowe hasło"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </div>
        <FormActions
          submitLabel={isSubmitting ? 'Aktualizowanie...' : 'Zaktualizuj'}
          onCancel={onCancel}
          disabled={isSubmitting}
        />
      </form>
      {status && <ProfileFormStatus message={status.message} tone={status.tone} />}
    </>
  );
}
