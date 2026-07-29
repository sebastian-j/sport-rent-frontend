import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import ScrollToTop from './components/core/ScrollToTop.tsx';
import DocumentLayout from './layouts/DocumentLayout.tsx';
import InfoLayout from './layouts/InfoLayout.tsx';
import Layout from './layouts/Layout';
import LoginLayout from './layouts/LoginLayout.tsx';
import ProfilePage from './pages/account/ProfilePage.tsx';
import ConfirmPasswordResetPage from './pages/auth/ConfirmPasswordResetPage.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.tsx';
import BootFittingHomePage from './pages/bootFitting/BootFittingHomePage.tsx';
import PrivacyPolicyPage from './pages/document/PrivacyPolicyPage.tsx';
import TosPage from './pages/document/TosPage.tsx';
import AboutPage from './pages/info/AboutPage.tsx';
import ContactPage from './pages/info/ContactPage.tsx';
import FaqPage from './pages/info/FaqPage.tsx';
import PointsPage from './pages/info/PointsPage.tsx';
import CartPage from './pages/rent/CartPage.tsx';
import FavoritesPage from './pages/rent/FavoritesPage.tsx';
import HomePage from './pages/rent/HomePage.tsx';
import OrderSummaryPage from './pages/rent/OrderSummaryPage.tsx';
import ProductPage from './pages/rent/ProductPage.tsx';
import SearchPage from './pages/rent/SearchPage.tsx';
import ServiceHomePage from './pages/service/ServiceHomePage.tsx';
import SubsiteSelectionPage from './pages/SubsiteSelectionPage.tsx';
import { BOOT_FITTING_ROUTES, RENT_ROUTES, ROOT_ROUTE, SERVICE_ROUTES } from './routes.ts';
import { AppProviders } from './providers/AppProviders.tsx';


function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path={ROOT_ROUTE} element={<SubsiteSelectionPage />} />
          <Route path={RENT_ROUTES.home}>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="favorites" element={<FavoritesPage />} />
              </Route>
              <Route path="product/:slug" element={<ProductPage />} />
            </Route>
            <Route element={<Layout showCategoryBar={false} />}>
              <Route path="search" element={<SearchPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="summary" element={<OrderSummaryPage />} />
              </Route>
            </Route>
          </Route>
          <Route element={<LoginLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password/confirm" element={<ConfirmPasswordResetPage />} />
          </Route>
          <Route element={<DocumentLayout />}>
            <Route path="/tos" element={<TosPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Route>
          <Route element={<InfoLayout />}>
            <Route path={BOOT_FITTING_ROUTES.home} element={<BootFittingHomePage />} />
            <Route path={SERVICE_ROUTES.home} element={<ServiceHomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/points" element={<PointsPage />} />
            <Route path="/faq" element={<FaqPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
