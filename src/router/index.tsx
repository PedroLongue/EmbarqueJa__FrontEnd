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
        <Route
          path="/"
          element={signed ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={currentUser?.isAdmin ? <Admin /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default AppRouter;
