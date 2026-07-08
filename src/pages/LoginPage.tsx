import ButtonCore from '../components/core/ButtonCore.tsx';
import {Link, useNavigate} from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // TODO: Implement login logic here
    }

    const handleGoogleLogin = () => {
        //TODO: Implement Google login logic here
    }

    return (
        <div className="flex flex-col items-center bg-white mt-[-90px] mb-8">
            <h1 className="text-4xl font-bold mb-8 text-[#193556]">Zaloguj się</h1>
            <div className="flex flex-col items-center justify-center w-[60vw] rounded-lg max-w-[800px] bg-gray-300 p-8 border-[2px] border-black">
                <form className="flex flex-col gap-4 w-[90%]">
                    <label htmlFor="Email">
                        Email
                    </label>
                    <input
                        name="Email"
                        type="email"
                        className="rounded-lg p-2 outline-none"
                    />
                    <label htmlFor="Password">
                        Hasło
                    </label>
                    <input
                        name="Password"
                        type="password"
                        className="rounded-lg p-2 outline-none"
                    />
                    <ButtonCore
                        text="Zaloguj się"
                        onClick={handleLogin}
                        className="ps-12 pe-12 p-2 text-[0.8vw] my-2"
                    />
                </form>
                
                <div className="w-[90%] text-left my-3">
                    <Link to="/forgot-password" className="text-black underline">
                        Zapomniałeś hasła?
                    </Link>
                </div>

                <ButtonCore
                    text="Kontynuuj z Google"
                    onClick={handleGoogleLogin}
                    className="ps-12 pe-12 p-2 text-[0.8vw] my-2 w-[90%]"
                />

                <div className="w-[90%] text-left my-3">
                    <p>Nie masz konta?</p>
                </div>

                <ButtonCore
                    text="Zarejestruj się"
                    onClick={() => {
                        navigate('/register');
                    }}
                    className="ps-12 pe-12 p-2 text-[0.8vw] my-2 w-[90%]"
                />

            </div>
            <div className="w-[60vw] max-w-[800px] text-left mt-4">
                <Link to="/privacy-policy" className="text-black underline text-[0.7vw]">
                    Polityka prywatności
                </Link>
            </div>
        </div>
    );
}