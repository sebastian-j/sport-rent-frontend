import { LockKeyhole, Mail } from 'lucide-react';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '../../api/auth.ts';
import googleLogo from '../../assets/google_logo.svg';
import AuthField from '../../components/auth/AuthField.tsx';
import AuthNotice from '../../components/auth/AuthNotice.tsx';
import AuthPageHeader from '../../components/auth/AuthPageHeader.tsx';
import { authLinkClassName } from '../../components/auth/authStyles.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { useAuth } from '../../features/auth/authContext.ts';
import { AUTH_ROUTES, DOCUMENT_ROUTES, RENT_ROUTES } from '../../routes.ts';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { establishSession } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginError(null);
    setHasInvalidCredentials(false);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoggingIn) return;

    setHasInvalidCredentials(false);
    setIsLoggingIn(true);

    try {
      const result = await login(formData);

      if (result.error || !result.data) {
        if (result.response?.status === 401) {
          setHasInvalidCredentials(true);
          setLoginError('Nieprawidłowy adres e-mail lub hasło');
          return;
        }

        setHasInvalidCredentials(false);
        setLoginError(`Logowanie nie powiodło się (HTTP ${result.response?.status ?? 'błąd'})`);
        return;
      }

      establishSession(result.data.access_token);

      const destination =
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
        RENT_ROUTES.home;
      navigate(destination, { replace: true });
    } catch {
      setHasInvalidCredentials(false);
      setLoginError('Nie udało się połączyć z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    //TODO: Implement Google login logic here
  };

  return (
    <section className="mx-auto w-full max-w-xl">
      <AuthPageHeader title="Witaj ponownie" />

      <form onSubmit={handleLogin} aria-busy={isLoggingIn} className="space-y-5">
        <AuthField
          name="email"
          id="email"
          label="Adres e-mail"
          icon={Mail}
          type="email"
          value={formData.email}
          required
          autoComplete="email"
          placeholder="nazwa@przyklad.pl"
          aria-invalid={hasInvalidCredentials}
          aria-describedby={hasInvalidCredentials ? 'login-error' : undefined}
          hasError={hasInvalidCredentials}
          onChange={handleChange}
        />
        <div>
          <AuthField
            name="password"
            id="password"
            label="Hasło"
            icon={LockKeyhole}
            type="password"
            value={formData.password}
            required
            autoComplete="current-password"
            placeholder="Wpisz swoje hasło"
            aria-invalid={hasInvalidCredentials}
            aria-describedby={hasInvalidCredentials ? 'login-error' : undefined}
            hasError={hasInvalidCredentials}
            onChange={handleChange}
          />
          <div className="mt-3 text-right text-sm">
            <Link to={AUTH_ROUTES.resetPassword} className={authLinkClassName}>
              Nie pamiętasz hasła?
            </Link>
          </div>
        </div>

        {isLoggingIn ? (
          <AuthNotice role="status">
            {loginError ? 'Ponownie sprawdzamy dane' : 'Sprawdzamy dane logowania'} <LoadingDots />
          </AuthNotice>
        ) : (
          loginError && (
            <AuthNotice id="login-error" role="alert" tone="error">
              {loginError}
            </AuthNotice>
          )
        )}

        <ButtonCore
          type="submit"
          disabled={isLoggingIn}
          className="h-12 w-full rounded-xl px-6 text-base font-bold"
        >
          {isLoggingIn ? (
            <span className="inline-flex items-center gap-2">
              Logowanie <LoadingDots />
            </span>
          ) : (
            'Zaloguj się'
          )}
        </ButtonCore>
      </form>

      <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-app-textMuted">
        <span className="h-px flex-1 bg-app-borderSoft" />
        lub
        <span className="h-px flex-1 bg-app-borderSoft" />
      </div>

      <ButtonCore
        inverted
        onClick={handleGoogleLogin}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-app-borderSoft bg-transparent px-6 text-base font-semibold text-app-text hover:border-app-border"
      >
        <img
          src={googleLogo}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 shrink-0"
          style={{ filter: 'none' }}
        />
        Kontynuuj z Google
      </ButtonCore>

      <div className="mt-7 rounded-xl border border-app-borderSoft px-4 py-3 text-center text-sm text-app-textMuted">
        Nie masz jeszcze konta?{' '}
        <Link to={AUTH_ROUTES.register} className={authLinkClassName}>
          Utwórz konto
        </Link>
      </div>
    </section>
  );
}
