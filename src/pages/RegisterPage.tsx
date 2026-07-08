import { Link } from 'react-router-dom';
import ButtonCore from '../components/core/ButtonCore';

export default function RegisterPage() {
  const handleRegister = () => {
    const passwordsMatch = () => {
      const password1 = document.getElementById('password1') as HTMLInputElement | null;
      const password2 = document.getElementById('password2') as HTMLInputElement | null;

      if (!password1 || !password2) {
        return false;
      }

      if (password1.value !== password2.value) {
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
    <div className="flex flex-col items-center bg-white mt-[-90px] mb-8">
      <h1 className="text-4xl font-bold mb-8 text-[#193556]">Zarejestruj się</h1>
      <div className="flex flex-col items-center justify-center w-[60vw] rounded-lg max-w-[800px] bg-gray-300 p-8">
        <form className="flex flex-col gap-4 w-[90%]">
          <label htmlFor="Email">Email</label>
          <input name="Email" type="email" className="rounded-lg p-2 outline-none" />
          <label htmlFor="Password">Hasło</label>
          <input
            name="Password"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password1"
          />
          <label htmlFor="ConfirmPassword">Powtórz hasło</label>
          <input
            name="ConfirmPassword"
            type="password"
            className="rounded-lg p-2 outline-none"
            id="password2"
          />

          <p className="text-lg font-semibold"> Adres </p>

          <label htmlFor="Country">Państwo</label>
          <input name="Country" type="text" className="rounded-lg p-2 outline-none" id="country" />
          <label htmlFor="City">Miasto</label>
          <input name="City" type="text" className="rounded-lg p-2 outline-none" id="city" />
          <label htmlFor="AddressLine1">Adres - pierwsza linia</label>
          <input
            name="AddressLine1"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine1"
          />
          <label htmlFor="AddressLine2">Adres - druga linia</label>
          <input
            name="AddressLine2"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="addressLine2"
          />
          <label htmlFor="PostalCode">Kod pocztowy</label>
          <input
            name="PostalCode"
            type="text"
            className="rounded-lg p-2 outline-none"
            id="postalCode"
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
        <Link to="/privacy-policy" className="text-black underline text-[0.7vw]">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
