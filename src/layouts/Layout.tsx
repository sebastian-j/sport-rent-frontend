import { Outlet } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';

type LayoutProps = {
  showCategoryBar?: boolean;
};

export default function Layout({ showCategoryBar = true }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen text-app-text bg-app-surface">
      <Header showCategoryBar={showCategoryBar} />
      <main className={`flex-grow ${showCategoryBar ? 'mt-12 md:mt-24' : 'mt-12'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
