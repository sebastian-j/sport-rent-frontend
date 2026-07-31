import { Mail } from 'lucide-react';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { resetPassword } from '../../api/auth.ts';
import AuthField from '../../components/auth/AuthField.tsx';
import AuthNotice from '../../components/auth/AuthNotice.tsx';
import AuthPageHeader from '../../components/auth/AuthPageHeader.tsx';
import { authLinkClassName } from '../../components/auth/authStyles.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { AUTH_ROUTES } from '../../routes.ts';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setHasSentMessage(false);
    setSendError(null);
  };

  const handleResetPassword = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) return;

    setHasSentMessage(false);
    setSendError(null);
    setIsSending(true);

    try {
      const result = await resetPassword({ email });

      if (result.error) {
        setSendError('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
        return;
      }

      setHasSentMessage(true);
    } catch {
      setSendError('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl">
      <AuthPageHeader title="Zresetuj hasło" />

      {hasSentMessage ? (
        <div className="space-y-5">
          <AuthNotice role="status" tone="success">
            <p className="font-semibold">Sprawdź swoją skrzynkę pocztową</p>
            <p className="mt-1 text-app-text">
              Jeśli konto dla adresu <span className="font-semibold">{email}</span> istnieje,
              wysłaliśmy link do ustawienia nowego hasła.
            </p>
          </AuthNotice>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <AuthField
            name="email"
            id="reset-password-email"
            label="Adres e-mail"
            icon={Mail}
            type="email"
            value={email}
            required
            autoComplete="email"
            placeholder="nazwa@przyklad.pl"
            aria-invalid={sendError !== null}
            aria-describedby={sendError ? 'reset-password-error' : undefined}
            hasError={sendError !== null}
            onChange={handleEmailChange}
          />

          {sendError && (
            <AuthNotice id="reset-password-error" role="alert" tone="error">
              {sendError}
            </AuthNotice>
          )}

          <ButtonCore
            type="submit"
            disabled={isSending}
            className="h-12 w-full rounded-xl px-6 text-base font-bold"
          >
            {isSending ? (
              <span className="inline-flex items-center gap-2">
                Wysyłanie <LoadingDots />
              </span>
            ) : (
              'Wyślij link do zmiany hasła'
            )}
          </ButtonCore>
        </form>
      )}

      <div className="mt-7 border-t border-app-borderSoft pt-5 text-center text-sm text-app-textMuted">
        Pamiętasz hasło?{' '}
        <Link to={AUTH_ROUTES.login} className={authLinkClassName}>
          Wróć do logowania
        </Link>
      </div>
    </section>
  );
}
