import { useState } from 'react';
import { Link } from 'react-router-dom';

import ButtonCore from '../../components/core/ButtonCore.tsx';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = () => {
    const passwordsMatch = () => {
      if (!formData.password || !formData.confirmPassword) {
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Hasła nie są takie same!');
        return false;
      }
      return true;
    };

    if (!formData.consent) {
      alert('Konieczne jest wyrażenie zgody na przetwarzanie danych.');
    }

    if (passwordsMatch()) {
      // Handle registration logic here
      alert(JSON.stringify(formData, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center bg-app-surface">
      <h1 className="mb-6 text-3xl font-bold text-app-textStrong sm:mb-8 sm:text-4xl">
        Zarejestruj się
      </h1>
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center rounded-lg border-2 border-app-borderSoft bg-app-surfaceElevated p-4 sm:p-6 md:p-8">
        <form className="flex w-full flex-col gap-4 sm:w-[90%]">
          <label htmlFor="email" className="text-app-textStrong">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            onChange={handleChange}
          />
          <label htmlFor="password" className="text-app-textStrong">
            Hasło
          </label>
          <input
            name="password"
            type="password"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="password1"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword" className="text-app-textStrong">
            Powtórz hasło
          </label>
          <input
            name="confirmPassword"
            type="password"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="password2"
            onChange={handleChange}
          />

          <p className="text-lg font-semibold text-app-textStrong"> Adres </p>

          <label htmlFor="country" className="text-app-textStrong">
            Państwo
          </label>
          <input
            name="country"
            type="text"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="country"
            onChange={handleChange}
          />
          <label htmlFor="city" className="text-app-textStrong">
            Miasto
          </label>
          <input
            name="city"
            type="text"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="city"
            onChange={handleChange}
          />
          <label htmlFor="addressLine1" className="text-app-textStrong">
            Adres - pierwsza linia
          </label>
          <input
            name="addressLine1"
            type="text"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="addressLine1"
            onChange={handleChange}
          />
          <label htmlFor="addressLine2" className="text-app-textStrong">
            Adres - druga linia
          </label>
          <input
            name="addressLine2"
            type="text"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="addressLine2"
            onChange={handleChange}
          />
          <label htmlFor="postalCode" className="text-app-textStrong">
            Kod pocztowy
          </label>
          <input
            name="postalCode"
            type="text"
            className="rounded-lg border border-app-borderSoft bg-app-surface p-3 text-app-text outline-none focus:ring-1 focus:ring-app-border"
            id="postalCode"
            onChange={handleChange}
          />
          <label
            htmlFor="consent"
            className="flex flex-row justify-between gap-4 text-app-textStrong"
          >
            <p>Zgoda na przetwarzanie danych osobowych</p>
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={() => setFormData({ ...formData, consent: !formData.consent })}
              className="h-6 w-6 cursor-pointer"
            />
          </label>
          <ButtonCore
            text="Zarejestruj się"
            onClick={handleRegister}
            className="my-2 p-2 px-6 text-sm sm:px-12 sm:text-base"
          />
        </form>

        <div className="my-3 w-full text-left sm:w-[90%]">
          <Link to="/login" className="text-app-textStrong underline">
            Wróć do logowania
          </Link>
        </div>
      </div>

      <div className="mt-4 w-full max-w-[800px] text-left">
        <Link to="/privacy-policy" target="_blank" className="text-sm text-app-textMuted underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
