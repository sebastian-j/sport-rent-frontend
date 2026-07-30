import { LockKeyhole, Mail } from 'lucide-react';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../api/auth.ts';
import type { components } from '../../api/generated/schema.ts';
import AuthField from '../../components/auth/AuthField.tsx';
import AuthFormSection from '../../components/auth/AuthFormSection.tsx';
import AuthNotice from '../../components/auth/AuthNotice.tsx';
import AuthPageHeader from '../../components/auth/AuthPageHeader.tsx';
import { authLinkClassName } from '../../components/auth/authStyles.ts';
import ButtonCore from '../../components/core/ButtonCore.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
import { AUTH_ROUTES, DOCUMENT_ROUTES } from '../../routes.ts';

type HTTPValidationError = components['schemas']['HTTPValidationError'];
type ValidationError = components['schemas']['ValidationError'];

const fieldLabels: Record<string, string> = {
  first_name: 'Imię',
  last_name: 'Nazwisko',
  email: 'Adres e-mail',
  password: 'Hasło',
  address: 'Adres',
  'address.first_line': 'Pierwsza linia adresu',
  'address.second_line': 'Druga linia adresu',
  'address.postal_code': 'Kod pocztowy',
  'address.city': 'Miasto',
  'address.country': 'Państwo',
};

const fieldConstraints: Record<string, string> = {
  first_name: 'Imię musi mieć od 1 do 100 znaków.',
  last_name: 'Nazwisko musi mieć od 1 do 100 znaków.',
  email: 'Podaj prawidłowy adres e-mail.',
  password: 'Hasło musi mieć od 8 do 128 znaków.',
  'address.first_line': 'Pierwsza linia adresu musi mieć od 1 do 255 znaków.',
  'address.second_line': 'Druga linia adresu może mieć maksymalnie 255 znaków.',
  'address.postal_code': 'Kod pocztowy musi mieć od 1 do 32 znaków.',
  'address.city': 'Miasto musi mieć od 1 do 100 znaków.',
  'address.country': 'Państwo musi mieć od 1 do 100 znaków.',
};

const getFieldPath = (error: ValidationError) =>
  error.loc.filter((segment) => segment !== 'body').join('.');

const formatValidationError = (error: ValidationError) => {
  const fieldPath = getFieldPath(error);
  const fieldLabel = fieldLabels[fieldPath] ?? fieldPath ?? 'Dane formularza';

  if (error.type === 'missing') {
    return `${fieldLabel}: pole jest wymagane.`;
  }

  if (error.type === 'extra_forbidden') {
    return `${fieldLabel}: pole nie jest obsługiwane.`;
  }

  return fieldConstraints[fieldPath] ?? `${fieldLabel}: wartość jest nieprawidłowa.`;
};

const getValidationMessages = (error: HTTPValidationError) => {
  if (!error.detail?.length) {
    return ['Sprawdź poprawność wprowadzonych danych.'];
  }

  return [...new Set(error.detail.map(formatValidationError))];
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      country: '',
      city: '',
      firstLine: '',
      secondLine: '',
      postalCode: '',
    },
    consent: false,
  });
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterError(null);
    setValidationErrors([]);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterError(null);
    setValidationErrors([]);
    setFormData((previousData) => ({
      ...previousData,
      address: {
        ...previousData.address,
        [name]: value,
      },
    }));
  };

  const handleRegister = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegistering) return;

    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Hasła nie są takie same.');
      setValidationErrors([]);
      return;
    }

    if (!formData.consent) {
      setRegisterError('Konieczne jest wyrażenie zgody na przetwarzanie danych.');
      setValidationErrors([]);
      return;
    }

    setRegisterError(null);
    setValidationErrors([]);
    setIsRegistering(true);

    try {
      const result = await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: {
          country: formData.address.country,
          city: formData.address.city,
          first_line: formData.address.firstLine,
          second_line: formData.address.secondLine || null,
          postal_code: formData.address.postalCode,
        },
      });

      if (result.error || !result.data) {
        if (result.response?.status === 409) {
          setRegisterError('Konto z tym adresem e-mail już istnieje.');
          return;
        }

        if (result.response?.status === 422) {
          setValidationErrors(getValidationMessages(result.error));
          return;
        }

        setRegisterError(
          `Rejestracja nie powiodła się (HTTP ${result.response?.status ?? 'błąd'}).`
        );
        return;
      }

      navigate(AUTH_ROUTES.login, { replace: true });
    } catch {
      setRegisterError('Nie udało się połączyć z serwerem. Spróbuj ponownie.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl">
      <AuthPageHeader title="Dołącz do Polar Sport Rent" />

      <form className="space-y-9" onSubmit={handleRegister} aria-busy={isRegistering}>
        <AuthFormSection title="Dane konta">
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField
              name="firstName"
              id="firstName"
              label="Imię"
              type="text"
              value={formData.firstName}
              required
              maxLength={100}
              autoComplete="given-name"
              placeholder="Jan"
              onChange={handleChange}
            />
            <AuthField
              name="lastName"
              id="lastName"
              label="Nazwisko"
              type="text"
              value={formData.lastName}
              required
              maxLength={100}
              autoComplete="family-name"
              placeholder="Kowalski"
              onChange={handleChange}
            />
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
              containerClassName="sm:col-span-2"
              onChange={handleChange}
            />
            <AuthField
              name="password"
              id="password"
              label="Hasło"
              icon={LockKeyhole}
              type="password"
              value={formData.password}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Minimum 8 znaków"
              onChange={handleChange}
            />
            <AuthField
              name="confirmPassword"
              id="confirmPassword"
              label="Powtórz hasło"
              icon={LockKeyhole}
              type="password"
              value={formData.confirmPassword}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="Wpisz hasło ponownie"
              onChange={handleChange}
            />
          </div>
        </AuthFormSection>

        <AuthFormSection title="Adres">
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField
              name="country"
              id="country"
              label="Państwo"
              type="text"
              value={formData.address.country}
              required
              autoComplete="country-name"
              placeholder="Polska"
              onChange={handleAddressChange}
            />
            <AuthField
              name="city"
              id="city"
              label="Miasto"
              type="text"
              value={formData.address.city}
              required
              autoComplete="address-level2"
              placeholder="Kraków"
              onChange={handleAddressChange}
            />
            <AuthField
              name="firstLine"
              id="addressLine1"
              label="Ulica i numer"
              type="text"
              value={formData.address.firstLine}
              required
              autoComplete="address-line1"
              placeholder="ul. Przykładowa 12"
              onChange={handleAddressChange}
            />
            <AuthField
              name="secondLine"
              id="addressLine2"
              label="Lokal (opcjonalnie)"
              type="text"
              value={formData.address.secondLine}
              autoComplete="address-line2"
              placeholder="np. lokal 4"
              onChange={handleAddressChange}
            />
            <AuthField
              name="postalCode"
              id="postalCode"
              label="Kod pocztowy"
              type="text"
              value={formData.address.postalCode}
              required
              autoComplete="postal-code"
              placeholder="00-000"
              className="sm:max-w-52"
              onChange={handleAddressChange}
            />
          </div>
        </AuthFormSection>

        <label
          htmlFor="consent"
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-app-borderSoft p-4 transition hover:border-app-border"
        >
          <input
            type="checkbox"
            name="consent"
            id="consent"
            checked={formData.consent}
            required
            onChange={(event) => {
              setRegisterError(null);
              setValidationErrors([]);
              setFormData((previousData) => ({
                ...previousData,
                consent: event.target.checked,
              }));
            }}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-app-surfaceStrong"
          />
          <span className="text-sm leading-6 text-app-textMuted">
            Wyrażam zgodę na przetwarzanie danych osobowych zgodnie z{' '}
            <Link
              to={DOCUMENT_ROUTES.privacyPolicy}
              target="_blank"
              rel="noopener noreferrer"
              className={authLinkClassName}
            >
              polityką prywatności
            </Link>
            .
          </span>
        </label>

        {registerError && (
          <AuthNotice role="alert" tone="error">
            {registerError}
          </AuthNotice>
        )}
        {validationErrors.length > 0 && (
          <AuthNotice role="alert" tone="error">
            <p className="font-semibold">Popraw następujące pola:</p>
            <ul className="mt-1 list-disc pl-5">
              {validationErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </AuthNotice>
        )}

        <ButtonCore
          className="h-12 w-full rounded-xl px-6 text-base font-bold"
          type="submit"
          disabled={isRegistering}
        >
          {isRegistering ? (
            <span className="inline-flex items-center gap-2">
              Tworzenie konta <LoadingDots />
            </span>
          ) : (
            'Utwórz konto'
          )}
        </ButtonCore>
      </form>

      <div className="mt-7 rounded-xl border border-app-borderSoft px-4 py-3 text-center text-sm text-app-textMuted">
        Masz już konto?{' '}
        <Link to={AUTH_ROUTES.login} className={authLinkClassName}>
          Zaloguj się
        </Link>
      </div>
    </section>
  );
}
