import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage.tsx';
import CartPage from './pages/CartPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import PointsPage from './pages/PointsPage.tsx';
import TosPage from './pages/TosPage.tsx';
import FaqPage from './pages/FaqPage.tsx';
import LoginLayout from './layouts/LoginLayout.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/*Header*/}
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          {/*Footer*/}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/points" element={<PointsPage />} />
          <Route path="/tos" element={<TosPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
