import Header from '../components/Header.tsx';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.tsx';
import InfoPanel from '../components/core/InfoPanel.tsx';

export default function InfoLayout() {
  return (
    <div className="flex flex-col min-h-screen text-app-text bg-app-surface">
      <Header showCategoryBar={false} />
      <main className="mt-12 flex flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <InfoPanel>
          <Outlet />
        </InfoPanel>
      </main>
      <Footer />
    </div>
  );
}
