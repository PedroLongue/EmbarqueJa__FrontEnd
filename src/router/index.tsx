import { Navigate, Route, Routes } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Header from '../components/Header';
import Admin from '../pages/Admin';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useEffect } from 'react';
import { getCurrentUser } from '../redux/features/authSlice';
import api from '../services/api';
import Footer from '../components/Footer';
import ChangePass from '../pages/ChangePass';
import PreviewTicket from '../pages/PreviewTicket';
import Checkout from '../pages/Checkout';
import MyPurchases from '../pages/MyPurchases';
import UserProfile from '../pages/UserProfile';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/change-pass"
          element={signed ? <ChangePass /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={currentUser?.isAdmin ? <Admin /> : <Navigate to="/login" />}
        />
        <Route
          path="/preview-ticket"
          element={signed ? <PreviewTicket /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={signed ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-purchases"
          element={signed ? <MyPurchases /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-profile"
          element={signed ? <UserProfile /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRouter;
