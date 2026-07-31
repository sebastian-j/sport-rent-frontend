import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, Outlet } from 'react-router-dom';

import LogoHeader from '../assets/layout/logo_header.webp';
import LoadingDots from '../components/core/LoadingDots.tsx';
import { useAuth } from '../features/auth/authContext.ts';
import { DOCUMENT_ROUTES, INFO_ROUTES, RENT_ROUTES, ROOT_ROUTE } from '../routes.ts';

export default function LoginLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-surface px-6">
        <div role="status" className="flex flex-col items-center gap-4 text-app-textMuted">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-app-borderSoft border-t-app-border" />
          <span className="text-sm font-medium">
            Sprawdzanie sesji <LoadingDots />
          </span>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to={RENT_ROUTES.home} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-app-surface text-app-text">
      <header className="px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link to={ROOT_ROUTE} className="block h-11 w-52 sm:h-12 sm:w-56">
            <span
              role="img"
              aria-label="Logo Polar Sport Rent"
              className="block h-full w-full bg-app-textStrong"
              style={{
                WebkitMask: `url(${LogoHeader}) center / contain no-repeat`,
                mask: `url(${LogoHeader}) center / contain no-repeat`,
              }}
            />
          </Link>
          <Link
            to={RENT_ROUTES.home}
            className="group flex items-center gap-2 rounded-xl border border-app-borderSoft px-3 py-2 text-sm font-semibold text-app-textMuted transition hover:border-app-border hover:text-app-textStrong sm:px-4"
          >
            <ArrowLeft
              aria-hidden="true"
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span className="hidden sm:inline">Wróć do wypożyczalni</span>
            <span className="sm:hidden">Wróć</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start px-4 pb-8 pt-2 sm:px-6 sm:pb-12 lg:items-center lg:px-10">
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-app-borderSoft bg-app-surface">
          <div className="min-w-0 p-6 sm:p-9 md:p-12 lg:p-14">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-sm text-app-textMuted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-t border-app-borderSoft pt-5 sm:flex-row">
          <p>© {new Date().getFullYear()} Polar Sport Rent</p>
          <nav
            aria-label="Informacje prawne"
            className="flex flex-wrap justify-center gap-x-5 gap-y-2"
          >
            <Link className="transition hover:text-app-textStrong" to={DOCUMENT_ROUTES.terms}>
              Regulamin
            </Link>
            <Link
              className="transition hover:text-app-textStrong"
              to={DOCUMENT_ROUTES.privacyPolicy}
            >
              Polityka prywatności
            </Link>
            <Link className="transition hover:text-app-textStrong" to={INFO_ROUTES.contact}>
              Kontakt
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
