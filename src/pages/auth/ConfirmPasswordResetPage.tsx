import { type SubmitEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { confirmPasswordReset, validatePasswordReset } from '../../api/auth.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { AUTH_ROUTES, DOCUMENT_ROUTES } from '../../routes.ts';

type PageState = 'validating' | 'ready' | 'invalid' | 'validation-error' | 'success';

function tokenFromLocation() {
  return new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '';
}

export default function ConfirmPasswordResetPage() {
  const [token] = useState(tokenFromLocation);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [pageState, setPageState] = useState<PageState>('validating');
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    if (!token) {
      setPageState('invalid');
      return;
    }

    let isActive = true;

    const validateToken = async () => {
      try {
        const result = await validatePasswordReset({ token });

        if (!isActive) return;

        if (result.response.status === 400) {
          setPageState('invalid');
          return;
        }

        if (result.error || !result.data) {
          setPageState('validation-error');
          return;
        }

        setEmail(result.data.email);
        setPageState('ready');
      } catch {
        if (isActive) setPageState('validation-error');
      }
    };

    void validateToken();

    return () => {
      isActive = false;
    };
  }, [token, validationAttempt]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (password !== repeatedPassword) {
      setSubmitError('Podane hasła nie są identyczne.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await confirmPasswordReset({
        token,
        new_password: password,
      });

      if (result.error) {
        setPageState('invalid');
        return;
      }

      setPassword('');
      setRepeatedPassword('');
      setPageState('success');
    } catch {
      setSubmitError('Nie udało się ustawić nowego hasła. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-textStrong">Ustaw nowe hasło</h1>

      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg border-[2px] border-app-borderSoft bg-app-surfaceElevated p-8">
        {pageState === 'validating' && (
          <p role="status" className="w-[90%] text-sm text-app-textMuted">
            Sprawdzanie linku <LoadingDots />
          </p>
        )}

        {pageState === 'invalid' && (
          <div className="flex w-[90%] flex-col gap-4">
            <p role="alert" className="text-sm text-app-danger">
              Link do zmiany hasła jest nieprawidłowy, wygasł lub został już wykorzystany.
            </p>
            <Link to={AUTH_ROUTES.resetPassword} className="text-app-textStrong underline">
              Wygeneruj nowy link
            </Link>
          </div>
        )}

        {pageState === 'validation-error' && (
          <div className="flex w-[90%] flex-col gap-4">
            <p role="alert" className="text-sm text-app-danger">
              Nie udało się sprawdzić linku. Sprawdź połączenie z internetem i spróbuj ponownie.
            </p>
            <ButtonCore
              text="Spróbuj ponownie"
              onClick={() => {
                setPageState('validating');
                setValidationAttempt((attempt) => attempt + 1);
              }}
              className="w-fit px-4 py-2"
            />
          </div>
        )}

        {pageState === 'success' && (
          <div className="flex w-[90%] flex-col gap-4">
            <p role="status" className="text-sm text-app-textMuted">
              Hasło zostało zmienione. Możesz się teraz zalogować.
            </p>
            <Link to={AUTH_ROUTES.login} className="text-app-textStrong underline">
              Przejdź do logowania
            </Link>
          </div>
        )}

        {pageState === 'ready' && (
          <div className="flex w-[90%] flex-col gap-4">
            <p className="text-center text-app-textMuted">{email}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="password-reset-new-password" className="text-app-textStrong">
                Nowe hasło
              </label>
              <input
                id="password-reset-new-password"
                type="password"
                value={password}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setSubmitError(null);
                }}
              />

              <label htmlFor="password-reset-repeated-password" className="text-app-textStrong">
                Powtórz nowe hasło
              </label>
              <input
                id="password-reset-repeated-password"
                type="password"
                value={repeatedPassword}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                aria-invalid={submitError !== null}
                aria-describedby={submitError ? 'password-reset-submit-error' : undefined}
                className={`rounded-lg border bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border ${
                  submitError ? 'border-app-danger' : 'border-app-borderSoft'
                }`}
                onChange={(event) => {
                  setRepeatedPassword(event.target.value);
                  setSubmitError(null);
                }}
              />

              {submitError && (
                <p
                  id="password-reset-submit-error"
                  role="alert"
                  className="text-sm text-app-danger"
                >
                  {submitError}
                </p>
              )}

              <ButtonCore
                type="submit"
                disabled={isSubmitting}
                className="my-2 p-2 ps-12 pe-12 text-[0.8vw]"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    Zapisywanie <LoadingDots />
                  </span>
                ) : (
                  'Ustaw nowe hasło'
                )}
              </ButtonCore>
            </form>
          </div>
        )}

        {pageState !== 'success' && (
          <div className="my-3 w-[90%] text-left">
            <Link to={AUTH_ROUTES.login} className="text-app-textStrong underline">
              Wróć do logowania
            </Link>
          </div>
        )}
      </div>

      <div className="mt-4 w-[60vw] max-w-[800px] text-left">
        <Link
          to={DOCUMENT_ROUTES.privacyPolicy}
          className="text-[0.7vw] text-app-textMuted underline"
        >
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
