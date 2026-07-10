import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DocumentPanel from '../components/core/DocumentPanel.tsx';

export default function DocumentLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto w-full max-w-5xl">
        <DocumentPanel>
          <Outlet />
        </DocumentPanel>
      </main>
    </div>
  );
}
