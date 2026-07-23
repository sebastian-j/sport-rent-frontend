import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { resetPassword } from '../../api/auth.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';

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
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-textStrong">Zresetuj hasło</h1>

      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg border-[2px] border-app-borderSoft bg-app-surfaceElevated p-8">
        <form onSubmit={handleResetPassword} className="flex w-[90%] flex-col gap-4">
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

          {hasSentMessage && (
            <p role="status" className="text-sm text-app-textMuted">
              Wiadomość z instrukcją resetowania hasła została wysłana.
            </p>
          )}

          {sendError && (
            <p id="reset-password-error" role="alert" className="text-sm text-app-danger">
              {sendError}
            </p>
          )}

          <ButtonCore
            text={
              isSending ? 'Wysyłanie…' : hasSentMessage ? 'Wyślij ponownie' : 'Wyślij wiadomość'
            }
            type="submit"
            disabled={isSending}
            className="my-2 p-2 ps-12 pe-12 text-[0.8vw]"
          />
        </form>

        <div className="my-3 w-[90%] text-left">
          <Link to="/login" className="text-app-textStrong underline">
            Wróć do logowania
          </Link>
        </div>
      </div>

      <div className="mt-4 w-[60vw] max-w-[800px] text-left">
        <Link to="/privacy-policy" className="text-[0.7vw] text-app-textMuted underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
