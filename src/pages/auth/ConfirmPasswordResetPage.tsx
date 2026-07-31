import { LockKeyhole, Mail } from 'lucide-react';
import { type SubmitEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { confirmPasswordReset, validatePasswordReset } from '../../api/auth.ts';
import AuthField from '../../components/auth/AuthField.tsx';
import AuthNotice from '../../components/auth/AuthNotice.tsx';
import AuthPageHeader from '../../components/auth/AuthPageHeader.tsx';
import { authLinkClassName } from '../../components/auth/authStyles.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { AUTH_ROUTES } from '../../routes.ts';

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
    <section className="mx-auto w-full max-w-xl">
      <AuthPageHeader title="Ustaw nowe hasło" />

      {pageState === 'validating' && (
        <div
          role="status"
          className="flex items-center gap-4 rounded-xl border border-app-borderSoft px-4 py-4 text-sm text-app-textMuted"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-app-borderSoft border-t-app-border" />
          Sprawdzamy poprawność linku <LoadingDots />
        </div>
      )}

      {pageState === 'invalid' && (
        <div className="space-y-5">
          <AuthNotice role="alert" tone="error">
            <p className="font-semibold">Ten link nie jest już aktywny</p>
            <p className="mt-1 text-app-text">
              Link jest nieprawidłowy, wygasł lub został już wykorzystany.
            </p>
          </AuthNotice>
          <Link
            to={AUTH_ROUTES.resetPassword}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-app-surfaceStrong px-6 text-base font-bold text-app-textInverted"
          >
            Wygeneruj nowy link
          </Link>
        </div>
      )}

      {pageState === 'validation-error' && (
        <div className="space-y-5">
          <AuthNotice role="alert" tone="error">
            Nie udało się sprawdzić linku. Sprawdź połączenie z internetem i spróbuj ponownie.
          </AuthNotice>
          <ButtonCore
            text="Spróbuj ponownie"
            onClick={() => {
              setPageState('validating');
              setValidationAttempt((attempt) => attempt + 1);
            }}
            className="h-12 w-full rounded-xl px-6 text-base font-bold"
          />
        </div>
      )}

      {pageState === 'success' && (
        <div className="space-y-5">
          <AuthNotice role="status" tone="success">
            <p className="font-semibold">Hasło zostało zmienione</p>
            <p className="mt-1 text-app-text">
              Możesz teraz zalogować się przy użyciu nowego hasła.
            </p>
          </AuthNotice>
          <Link
            to={AUTH_ROUTES.login}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-app-surfaceStrong px-6 text-base font-bold text-app-textInverted"
          >
            Przejdź do logowania
          </Link>
        </div>
      )}

      {pageState === 'ready' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl border border-app-borderSoft px-4 py-3 text-sm text-app-textMuted">
            <Mail aria-hidden="true" size={18} className="shrink-0" />
            <span className="min-w-0 truncate">{email}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthField
              id="password-reset-new-password"
              label="Nowe hasło"
              icon={LockKeyhole}
              type="password"
              value={password}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Minimum 8 znaków"
              onChange={(event) => {
                setPassword(event.target.value);
                setSubmitError(null);
              }}
            />
            <AuthField
              id="password-reset-repeated-password"
              label="Powtórz nowe hasło"
              icon={LockKeyhole}
              type="password"
              value={repeatedPassword}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Wpisz hasło ponownie"
              aria-invalid={submitError !== null}
              aria-describedby={submitError ? 'password-reset-submit-error' : undefined}
              hasError={submitError !== null}
              onChange={(event) => {
                setRepeatedPassword(event.target.value);
                setSubmitError(null);
              }}
            />

            {submitError && (
              <AuthNotice id="password-reset-submit-error" role="alert" tone="error">
                {submitError}
              </AuthNotice>
            )}

            <ButtonCore
              text={isSubmitting ? 'Zapisywanie' : 'Ustaw nowe hasło'}
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl px-6 text-base font-bold"
            />
          </form>
        </div>
      )}

      {pageState !== 'success' && (
        <div className="mt-7 border-t border-app-borderSoft pt-5 text-center text-sm text-app-textMuted">
          <Link to={AUTH_ROUTES.login} className={authLinkClassName}>
            Wróć do logowania
          </Link>
        </div>
      )}
    </section>
  );
}
