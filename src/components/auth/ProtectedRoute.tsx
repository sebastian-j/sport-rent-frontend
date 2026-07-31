import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/authContext.ts';
import { AUTH_ROUTES } from '../../routes.ts';
import LoadingDots from '../core/LoadingDots.tsx';

const ProtectedRoute = () => {
  const { status, retrySessionRestore } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <p role="status">
        Sprawdzanie sesji <LoadingDots />
      </p>
    );
  }

  if (status === 'error') {
    return (
      <div role="alert">
        <p>Nie udało się sprawdzić sesji.</p>
        <button type="button" onClick={retrySessionRestore}>
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Navigate to={AUTH_ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
