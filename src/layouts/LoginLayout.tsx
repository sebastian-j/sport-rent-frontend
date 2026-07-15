import { Link, Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import LogoHeader from '../assets/logo_header.png';
export default function LoginLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4">
        <Link to="/" className="mx-auto my-5 block h-28 w-[min(700px,80vw)]">
          <span
            role="img"
            aria-label="Logo Polar Sport Rent"
            className="block h-full w-full bg-app-text"
            style={{
              WebkitMask: `url(${LogoHeader}) center / contain no-repeat`,
              mask: `url(${LogoHeader}) center / contain no-repeat`,
            }}
          />
        </Link>
      </header>
      <main className="flex-grow mt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
