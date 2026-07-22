import { Outlet } from 'react-router-dom';

import DocumentPanel from '../components/core/DocumentPanel.tsx';

export default function DocumentLayout() {
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
