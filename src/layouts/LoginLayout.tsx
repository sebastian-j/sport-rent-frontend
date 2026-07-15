import { Link, Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import LogoHeader from '../assets/logo_header.png';
export default function LoginLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-app-surface text-app-text">
      <header className="py-4">
        <Link to="/">
          <img src={LogoHeader} alt="Logo" className="h-28 mx-auto my-5" />
        </Link>
      </header>
      <main className="flex-grow mt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
