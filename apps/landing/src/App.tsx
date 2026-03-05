import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardPage from '@/pages/DashboardPage';

// Product Pages
import FeaturesPage from '@/pages/FeaturesPage';
import ArchitecturePage from '@/pages/ArchitecturePage';
import SecurityPage from '@/pages/SecurityPage';
import ChangelogPage from '@/pages/ChangelogPage';

// Company Pages
import AboutPage from '@/pages/AboutPage';
import BlogPage from '@/pages/BlogPage';
import CareersPage from '@/pages/CareersPage';
import PressPage from '@/pages/PressPage';
import ContactPage from '@/pages/ContactPage';

// Resources Pages
import DocumentationPage from '@/pages/DocumentationPage';
import ApiReferencePage from '@/pages/ApiReferencePage';
import CommunityPage from '@/pages/CommunityPage';
import SupportPage from '@/pages/SupportPage';
import StatusPage from '@/pages/StatusPage';

// Legal Pages
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import CookiesPage from '@/pages/CookiesPage';
import DpaPage from '@/pages/DpaPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public route component (redirects to app if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/app" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Product Routes */}
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />

          {/* Company Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Resources Routes */}
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/status" element={<StatusPage />} />

          {/* Legal Routes */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/dpa" element={<DpaPage />} />

          {/* Protected Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
