import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/authContext.ts';

const ProtectedRoute = () => {
  const { status, retrySessionRestore } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <p role="status">Sprawdzanie sesji…</p>;
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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
