import ButtonCore from '../components/core/ButtonCore.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    alert(`Email: ${formData.email}, Password: ${formData.password}; Ustawiono accessToken`);

    // TODO: Implement login logic here
    localStorage.setItem('accessToken', `${formData.email}-${formData.password}`);
    navigate('/');
  };

  const handleGoogleLogin = () => {
    //TODO: Implement Google login logic here
  };

  return (
    <div className="mb-8 mt-[-90px] flex flex-col items-center bg-app-surface">
      <h1 className="mb-8 text-4xl font-bold text-app-text">Zaloguj się</h1>
      <div className="flex w-[60vw] max-w-[800px] flex-col items-center justify-center rounded-lg border-[2px] border-app-border bg-app-panel p-8">
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
            onChange={handleChange}
          />
          <ButtonCore
            text="Zaloguj się"
            onClick={handleLogin}
            className="ps-12 pe-12 p-2 text-[0.8vw] my-2"
          />
        </form>

        <div className="w-[90%] text-left my-3">
          <Link to="/forgot-password" className="text-app-textNeutral underline">
            Zapomniałeś hasła?
          </Link>
        </div>

        <ButtonCore
          text="Kontynuuj z Google"
          onClick={handleGoogleLogin}
          className="ps-12 pe-12 p-2 text-[0.8vw] my-2 w-[90%]"
        />

        <div className="w-[90%] text-left my-3">
          <p>
            Nie masz konta?{' '}
            <Link to="/register" className="text-app-textNeutral underline">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
      <div className="w-[60vw] max-w-[800px] text-left mt-4">
        <Link to="/privacy-policy" className="text-[0.7vw] text-app-textNeutral underline">
          Polityka prywatności
        </Link>
      </div>
    </div>
  );
}
