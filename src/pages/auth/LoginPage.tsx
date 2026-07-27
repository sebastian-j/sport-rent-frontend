import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { login } from '../../api/auth.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import { useAuth } from '../../features/auth/authContext.ts';

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
        (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';
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
    <div className="flex flex-col items-center bg-app-surface">
      <h1 className="mb-6 text-3xl font-bold text-app-textStrong sm:mb-8 sm:text-4xl">
        Zaloguj się
      </h1>
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center rounded-lg border-2 border-app-borderSoft bg-app-surfaceElevated p-4 sm:p-6 md:p-8">
        <form
          onSubmit={handleLogin}
          aria-busy={isLoggingIn}
          className="flex w-full flex-col gap-4 sm:w-[90%]"
        >
          <label htmlFor="email" className="text-app-textStrong">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            value={formData.email}
            required
            autoComplete="email"
            aria-invalid={hasInvalidCredentials}
            aria-describedby={hasInvalidCredentials ? 'login-error' : undefined}
            className={`rounded-lg border p-3 outline-none bg-app-surface text-app-text focus:ring-1 focus:ring-app-border ${
              hasInvalidCredentials ? 'border-app-danger' : 'border-app-borderSoft'
            }`}
            onChange={handleChange}
          />
          <label htmlFor="password" className="text-app-textStrong">
            Hasło
          </label>
          <input
            name="password"
            id="password"
            type="password"
            required
            autoComplete="current-password"
            aria-invalid={hasInvalidCredentials}
            aria-describedby={hasInvalidCredentials ? 'login-error' : undefined}
            className={`rounded-lg border p-3 outline-none bg-app-surface text-app-text focus:ring-1 focus:ring-app-border ${
              hasInvalidCredentials ? 'border-app-danger' : 'border-app-borderSoft'
            }`}
            onChange={handleChange}
          />
          {isLoggingIn ? (
            <p role="status" className="text-sm text-app-textMuted">
              {loginError ? 'Ponowne sprawdzanie danych…' : 'Sprawdzanie danych…'}
            </p>
          ) : (
            loginError && (
              <p id="login-error" role="alert" className="text-sm text-app-danger">
                {loginError}
              </p>
            )
          )}
          <ButtonCore
            text={isLoggingIn ? 'Logowanie…' : 'Zaloguj się'}
            type="submit"
            className={`my-2 p-2 px-6 text-sm sm:px-12 sm:text-base ${
              isLoggingIn ? 'pointer-events-none cursor-wait opacity-70' : ''
            }`}
          />
        </form>

        <div className="my-3 w-full text-left sm:w-[90%]">
          <Link to="/reset-password" className="text-app-textStrong underline">
            Zapomniałeś hasła?
          </Link>
        </div>

        <ButtonCore
          text="Kontynuuj z Google"
          onClick={handleGoogleLogin}
          className="my-2 w-full p-2 px-6 text-sm sm:w-[90%] sm:px-12 sm:text-base"
        />

        <div className="my-3 w-full text-left sm:w-[90%]">
          <p className="text-app-textMuted">
            Nie masz konta?{' '}
            <Link to="/register" className="text-app-textStrong underline">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-4 w-full max-w-[800px] text-left">
        <Link to="/privacy-policy" className="text-sm text-app-textMuted underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
