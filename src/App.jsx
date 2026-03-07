import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import AboutContacts from './components/AboutContacts';
import Doctors from './components/Doctors';
import OurServices from './components/OurServices';
import BlogList from './components/BlogList';
import EducationKnowledgeHub from './components/EducationKnowledgeHub';
import Gallery from './components/Gallery';
import Timetable from './components/Timetable';
import PatientsForum from './components/PatientsForum';
import ErrorPage from './components/ErrorPage';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/Signup';
import AdminLogin from './pages/auth/AdminLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import { useAuth } from './store/hooks';
import { getAssetUrl } from './config';

const BlogDetails = lazy(() => import('./components/BlogDetails'));
const EducationDetailPage = lazy(() => import('./pages/education/EducationDetailPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const MyLearningPage = lazy(() => import('./pages/myLearning/MyLearningPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const EducationPage = lazy(() => import('./pages/education/EducationPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));
const PaymentsPage = lazy(() => import('./pages/payments/PaymentsPage'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const PatientCareList = lazy(() => import('./pages/patientCare/PatientCareList'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));

function AdminRoute({ children }) {
  const { isSuperAdmin, loading } = useAuth();
  if (loading) {
    return null;
  }
  if (!isSuperAdmin) {
    return <Navigate to="/login/admin" replace />;
  }
  return children;
}

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const url = getAssetUrl('/images/icons/category.svg');
    document.documentElement.style.setProperty('--category-icon-url', url ? `url(${url})` : '');
  }, []);

  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>Loading...</div>}>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="patient-care" element={<PatientCareList />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact-testimonials" element={<AboutContacts />} />
        <Route path="our-services" element={<OurServices />} />
        <Route path="doctor-hospital-services" element={<Doctors />} />
        <Route path="id-education-knowledge-hub" element={<EducationKnowledgeHub />} />
        <Route path="id-education-knowledge-hub/item/:id" element={<EducationDetailPage />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/:blogId" element={<BlogDetails />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="patient-care-appointments" element={<PatientsForum />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-learning"
          element={
            <ProtectedRoute>
              <MyLearningPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    </Suspense>
  );
}

export default App;
