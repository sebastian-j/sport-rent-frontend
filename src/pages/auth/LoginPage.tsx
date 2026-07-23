import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '../../api/auth.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';

export default function LoginPage() {
  const navigate = useNavigate();

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

      if (result.error) {
        if (result.response.status === 401) {
          setHasInvalidCredentials(true);
          setLoginError('Nieprawidłowy adres e-mail lub hasło');
          return;
        }

        setHasInvalidCredentials(false);
        setLoginError(`Logowanie nie powiodło się (HTTP ${result.response.status})`);
        return;
      }

      localStorage.setItem('accessToken', result.data.access_token);
      localStorage.setItem('refreshToken', result.data.refresh_token);
      navigate('/');
    } catch {
      setHasInvalidCredentials(false);
      setLoginError('Nie udało się połączyć z serwerem. Spróbuj ponownie.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    //TODO: Implement Google login logic here
    localStorage.setItem('accessToken', 'accessTokenValue');
    localStorage.setItem('refreshToken', 'refreshTokenValue');
    navigate('/');
  };

  return (
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-textStrong">Zaloguj się</h1>
      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg border-[2px] border-app-borderSoft bg-app-surfaceElevated p-8">
        <form
          onSubmit={handleLogin}
          aria-busy={isLoggingIn}
          className="flex flex-col gap-4 w-[90%]"
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
            className={`ps-12 pe-12 p-2 text-[0.8vw] my-2 ${
              isLoggingIn ? 'pointer-events-none cursor-wait opacity-70' : ''
            }`}
          />
        </form>

        <div className="w-[90%] text-left my-3">
          <Link to="/reset-password" className="text-app-textStrong underline">
            Zapomniałeś hasła?
          </Link>
        </div>

        <ButtonCore
          text="Kontynuuj z Google"
          onClick={handleGoogleLogin}
          className="ps-12 pe-12 p-2 text-[0.8vw] my-2 w-[90%]"
        />

        <div className="w-[90%] text-left my-3">
          <p className="text-app-textMuted">
            Nie masz konta?{' '}
            <Link to="/register" className="text-app-textStrong underline">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link to="/privacy-policy" className="text-[0.7vw] text-app-textMuted underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
