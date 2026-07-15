import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './pages/store/HomePage.tsx';
import FavoritesPage from './pages/store/FavoritesPage.tsx';
import CartPage from './pages/store/CartPage.tsx';
import ProfilePage from './pages/account/ProfilePage.tsx';
import AboutPage from './pages/info/AboutPage.tsx';
import ContactPage from './pages/info/ContactPage.tsx';
import PointsPage from './pages/info/PointsPage.tsx';
import TosPage from './pages/document/TosPage.tsx';
import FaqPage from './pages/info/FaqPage.tsx';
import LoginLayout from './layouts/LoginLayout.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import ProductPage from './pages/store/ProductPage.tsx';
import DocumentLayout from './layouts/DocumentLayout.tsx';
import PrivacyPolicyPage from './pages/document/PrivacyPolicyPage.tsx';
import SearchPage from './pages/store/SearchPage.tsx';
import ScrollToTop from './components/core/ScrollToTop.tsx';
import { ThemeProvider } from './components/core/ThemeSelector.tsx';
import InfoLayout from './layouts/InfoLayout.tsx';

function App() {
  return (
      <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          <Route path="/product/:slug" element={<ProductPage />} />
        </Route>
        <Route element={<Layout showCategoryBar={false} />}>
          <Route path="/search" element={<SearchPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Route>
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<DocumentLayout />}>
          <Route path="/tos" element={<TosPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
        <Route element={<InfoLayout />}>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/points" element={<PointsPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </ThemeProvider>
  );
}

export default App;
