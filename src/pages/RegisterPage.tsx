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
      alert(JSON.stringify(formData, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center bg-white mt-[-90px] mb-8">
      <h1 className="text-4xl font-bold mb-8 text-[#193556]">Zarejestruj się</h1>
      <div className="flex flex-col items-center justify-center w-[60vw] rounded-lg max-w-[800px] bg-gray-300 p-8">
        <form className="flex flex-col gap-4 w-[90%]">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            className="rounded-lg p-2 outline-none"
            onChange={handleChange}
          />
          <label htmlFor="password">Hasło</label>
          <input
            name="password"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password1"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword">Powtórz hasło</label>
          <input
            name="confirmPassword"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password2"
            onChange={handleChange}
          />

          <p className="text-lg font-semibold"> Adres </p>

          <label htmlFor="country">Państwo</label>
          <input
            name="country"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="country"
            onChange={handleChange}
          />
          <label htmlFor="city">Miasto</label>
          <input
            name="city"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="city"
            onChange={handleChange}
          />
          <label htmlFor="addressLine1">Adres - pierwsza linia</label>
          <input
            name="addressLine1"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine1"
            onChange={handleChange}
          />
          <label htmlFor="addressLine2">Adres - druga linia</label>
          <input
            name="addressLine2"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine2"
            onChange={handleChange}
          />
          <label htmlFor="postalCode">Kod pocztowy</label>
          <input
            name="postalCode"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="postalCode"
            onChange={handleChange}
          />
          <ButtonCore
            text="Zarejestruj się"
            onClick={handleRegister}
            className="ps-12 pe-12 p-2 text-[0.8vw] my-2"
          />
        </form>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link to="/privacy-policy" className="text-black underline text-[0.7vw]">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
