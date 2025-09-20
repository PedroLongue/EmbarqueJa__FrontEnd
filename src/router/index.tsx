import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useEffect } from 'react';
import { getCurrentUser } from '../redux/features/authSlice';
import api from '../services/api';
import Footer from '../components/Footer';
import { Box, CircularProgress } from '@mui/material';
import PrivacyPolicy from '../pages/PrivacyPolicy';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Admin = lazy(() => import('../pages/Admin'));
const ChangePass = lazy(() => import('../pages/ChangePass'));
const PreviewTicket = lazy(() => import('../pages/PreviewTicket'));
const Checkout = lazy(() => import('../pages/Checkout'));
const MyPurchases = lazy(() => import('../pages/MyPurchases'));
const UserProfile = lazy(() => import('../pages/UserProfile'));
const ValidatePassengers = lazy(() => import('../pages/ValidatePassengers'));
const ValidateFromQrCode = lazy(() => import('../pages/ValidateFromQrCode'));

const PageLoading = () => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

const AppRouter = () => {
  const { signed, currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadingStoreData = () => {
      const storageToken = localStorage.getItem('@Auth:token');

      if (storageToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
        dispatch(getCurrentUser());
      }
    };
    loadingStoreData();
  }, []);

  return (
    <>
      <Header />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/change-pass"
            element={
              signed ? (
                <Suspense fallback={<PageLoading />}>
                  <ChangePass />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoading />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<PageLoading />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              currentUser?.isAdmin ? (
                <Suspense fallback={<PageLoading />}>
                  <Admin />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/validate-passengers"
            element={
              currentUser?.isAdmin ? (
                <Suspense fallback={<PageLoading />}>
                  <ValidatePassengers />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/validate-from-qr-code"
            element={
              <Suspense fallback={<PageLoading />}>
                <ValidateFromQrCode />
              </Suspense>
            }
          />
          <Route
            path="/preview-ticket"
            element={
              signed ? (
                <Suspense fallback={<PageLoading />}>
                  <PreviewTicket />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/checkout"
            element={
              signed ? (
                <Suspense fallback={<PageLoading />}>
                  <Checkout />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/my-purchases"
            element={
              signed ? (
                <Suspense fallback={<PageLoading />}>
                  <MyPurchases />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/my-profile"
            element={
              signed ? (
                <Suspense fallback={<PageLoading />}>
                  <UserProfile />
                </Suspense>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/politica-privacidade"
            element={
              <Suspense fallback={<PageLoading />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
};

export default AppRouter;
