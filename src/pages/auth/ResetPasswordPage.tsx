import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { resetPassword } from '../../api/auth.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import PageTitle from '../../components/core/PageTitle.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { AUTH_ROUTES, DOCUMENT_ROUTES } from '../../routes.ts';

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
    <div className="flex flex-col items-center bg-app-surface">
      <PageTitle className="mb-6 text-center sm:mb-8">Zresetuj hasło</PageTitle>

      <div className="flex w-full max-w-[800px] flex-col items-center justify-center rounded-lg border-2 border-app-borderSoft bg-app-surfaceElevated p-4 sm:p-6 md:p-8">
        {hasSentMessage ? (
          <p role="status" className="w-[90%] text-sm text-app-textMuted">
            Jeśli konto istnieje, link do ustawienia nowego hasła został wygenerowany.
          </p>
        ) : (
          <form onSubmit={handleResetPassword} className="flex w-full flex-col gap-4 sm:w-[90%]">
            <p className="text-app-textMuted">
              Podaj adres e-mail przypisany do konta. Wyślemy na niego wiadomość umożliwiającą
              ustawienie nowego hasła.
            </p>

            <label htmlFor="reset-password-email" className="text-app-textStrong">
              Email
            </label>
            <input
              name="email"
              id="reset-password-email"
              type="email"
              value={email}
              required
              autoComplete="email"
              aria-invalid={sendError !== null}
              aria-describedby={sendError ? 'reset-password-error' : undefined}
              className={`rounded-lg border bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border ${
                sendError ? 'border-app-danger' : 'border-app-borderSoft'
              }`}
              onChange={handleEmailChange}
            />

            {sendError && (
              <p id="reset-password-error" role="alert" className="text-sm text-app-danger">
                {sendError}
              </p>
            )}

            <ButtonCore
              type="submit"
              disabled={isSending}
              className="my-2 p-2 px-6 text-sm sm:px-12 sm:text-base"
            >
              {isSending ? (
                <span className="inline-flex items-center gap-2">
                  Wysyłanie <LoadingDots />
                </span>
              ) : (
                'Wyślij wiadomość'
              )}
            </ButtonCore>
          </form>
        )}

        <div className="my-3 w-full text-left sm:w-[90%]">
          <Link to={AUTH_ROUTES.login} className="text-app-textStrong underline">
            Wróć do logowania
          </Link>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[800px] text-left">
        <Link to={DOCUMENT_ROUTES.privacyPolicy} className="text-sm text-app-textMuted underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
