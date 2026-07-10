import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen text-app-text bg-app-surface">
      <Header />
      <main className="flex-grow mt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
