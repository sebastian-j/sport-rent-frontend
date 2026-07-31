import { Link, Navigate, Outlet } from 'react-router-dom';

import LogoHeader from '../assets/layout/logo_header.webp';
import Footer from '../components/Footer';
import { useAuth } from '../features/auth/authContext.ts';
import { RENT_ROUTES, ROOT_ROUTE } from '../routes.ts';

export default function LoginLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <p role="status">Sprawdzanie sesji…</p>;
  }

  if (status === 'authenticated') {
    return <Navigate to={RENT_ROUTES.home} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-app-surface text-app-text">
      <header className="px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <Link
          to={ROOT_ROUTE}
          className="mx-auto block h-16 w-full max-w-[280px] sm:h-20 sm:max-w-[420px] md:h-24 md:max-w-[560px]"
        >
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
      <main className="flex-grow px-4 pb-8 pt-3 sm:px-6 sm:pb-10 sm:pt-6 md:px-8 md:pb-12 md:pt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
