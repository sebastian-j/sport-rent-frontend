import { Link } from 'react-router-dom';
import { useState } from 'react';
import ButtonCore from '../components/core/ButtonCore';

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

    if (passwordsMatch()) {
      // Handle registration logic here
    }
  };

  return (
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-text">Zarejestruj się</h1>
      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg bg-app-panel p-8">
        <form className="flex flex-col gap-4 w-[90%]">
          <label htmlFor="Email">Email</label>
          <input
            name="Email"
            type="email"
            className="rounded-lg p-2 outline-none"
            onChange={handleChange}
          />
          <label htmlFor="Password">Hasło</label>
          <input
            name="Password"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password1"
            onChange={handleChange}
          />
          <label htmlFor="ConfirmPassword">Powtórz hasło</label>
          <input
            name="ConfirmPassword"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password2"
            onChange={handleChange}
          />

          <p className="text-lg font-semibold"> Adres </p>

          <label htmlFor="Country">Państwo</label>
          <input
            name="Country"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="country"
            onChange={handleChange}
          />
          <label htmlFor="City">Miasto</label>
          <input
            name="City"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="city"
            onChange={handleChange}
          />
          <label htmlFor="AddressLine1">Adres - pierwsza linia</label>
          <input
            name="AddressLine1"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine1"
            onChange={handleChange}
          />
          <label htmlFor="AddressLine2">Adres - druga linia</label>
          <input
            name="AddressLine2"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine2"
            onChange={handleChange}
          />
          <label htmlFor="PostalCode">Kod pocztowy</label>
          <input
            name="PostalCode"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="postalCode"
            onChange={handleChange}
          />
          <ButtonCore
            text="Zarejestruj się"
            onClick={() => {
              handleRegister();
            }}
            className="ps-12 pe-12 p-2 text-[0.8vw] my-2"
          />
        </form>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link to="/privacy-policy" className="text-[0.7vw] text-app-textNeutral underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
