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
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-textStrong">Zarejestruj się</h1>
      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg border-[2px] border-app-borderSoft bg-app-surfaceElevated p-8">
        <form className="flex flex-col gap-4 w-[90%]">
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
          <label htmlFor="consent" className="flex flex-row justify-between text-app-textStrong">
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
            className="ps-12 pe-12 p-2 text-[0.8vw] my-2"
          />
        </form>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link
          to="/privacy-policy"
          target="_blank"
          className="text-[0.7vw] text-app-textMuted underline"
        >
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
