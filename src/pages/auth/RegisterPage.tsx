import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../api/auth.ts';
import type { components } from '../../api/generated/schema.ts';
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
    <div className="flex flex-col items-center bg-app-surface">
      <h1 className="mb-6 text-3xl font-bold text-app-textStrong sm:mb-8 sm:text-4xl">
        Zarejestruj się
      </h1>
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center rounded-lg border-2 border-app-borderSoft bg-app-surfaceElevated p-4 sm:p-6 md:p-8">
        <form
          className="flex w-full flex-col gap-4 sm:w-[90%]"
          onSubmit={handleRegister}
          aria-busy={isRegistering}
        >
          <label htmlFor="firstName" className="text-app-textStrong">
            Imię
          </label>
          <input
            name="firstName"
            id="firstName"
            type="text"
            value={formData.firstName}
            required
            maxLength={100}
            autoComplete="given-name"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            onChange={handleChange}
          />
          <label htmlFor="lastName" className="text-app-textStrong">
            Nazwisko
          </label>
          <input
            name="lastName"
            id="lastName"
            type="text"
            value={formData.lastName}
            required
            maxLength={100}
            autoComplete="family-name"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            onChange={handleChange}
          />
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
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            onChange={handleChange}
          />
          <label htmlFor="password" className="text-app-textStrong">
            Hasło
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            required
            autoComplete="new-password"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="password"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword" className="text-app-textStrong">
            Powtórz hasło
          </label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            required
            autoComplete="new-password"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="confirmPassword"
            onChange={handleChange}
          />

          <p className="text-lg font-semibold text-app-textStrong"> Adres </p>

          <label htmlFor="country" className="text-app-textStrong">
            Państwo
          </label>
          <input
            name="country"
            type="text"
            value={formData.address.country}
            required
            autoComplete="country-name"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="country"
            onChange={handleAddressChange}
          />
          <label htmlFor="city" className="text-app-textStrong">
            Miasto
          </label>
          <input
            name="city"
            type="text"
            value={formData.address.city}
            required
            autoComplete="address-level2"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="city"
            onChange={handleAddressChange}
          />
          <label htmlFor="addressLine1" className="text-app-textStrong">
            Adres - pierwsza linia
          </label>
          <input
            name="firstLine"
            type="text"
            value={formData.address.firstLine}
            required
            autoComplete="address-line1"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="addressLine1"
            onChange={handleAddressChange}
          />
          <label htmlFor="addressLine2" className="text-app-textStrong">
            Adres - druga linia
          </label>
          <input
            name="secondLine"
            type="text"
            value={formData.address.secondLine}
            autoComplete="address-line2"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="addressLine2"
            onChange={handleAddressChange}
          />
          <label htmlFor="postalCode" className="text-app-textStrong">
            Kod pocztowy
          </label>
          <input
            name="postalCode"
            type="text"
            value={formData.address.postalCode}
            required
            autoComplete="postal-code"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="postalCode"
            onChange={handleAddressChange}
          />
          <label htmlFor="consent" className="flex flex-row justify-between text-app-textStrong">
            <span>Zgoda na przetwarzanie danych osobowych</span>
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
              className="h-6 w-6 cursor-pointer"
            />
          </label>
          {registerError && (
            <p role="alert" className="text-sm text-app-danger">
              {registerError}
            </p>
          )}
          {validationErrors.length > 0 && (
            <div role="alert" className="text-sm text-app-danger">
              <p>Popraw następujące pola:</p>
              <ul className="list-disc pl-5">
                {validationErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          <ButtonCore
            className="my-2 p-2 px-6 text-sm sm:px-12 sm:text-base"
            type="submit"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <span className="inline-flex items-center gap-2">
                Rejestrowanie <LoadingDots />
              </span>
            ) : (
              'Zarejestruj się'
            )}
          </ButtonCore>
        </form>

        <div className="my-3 w-full text-left sm:w-[90%]">
          <Link to={AUTH_ROUTES.login} className="text-app-textStrong underline">
            Wróć do logowania
          </Link>
        </div>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link
          to={DOCUMENT_ROUTES.privacyPolicy}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.7vw] text-app-textMuted underline"
        >
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
