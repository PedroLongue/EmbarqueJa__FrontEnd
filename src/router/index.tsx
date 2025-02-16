import { Navigate, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Header from '../components/Header';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';

const AppRouter = () => {
  const { signed } = useContext(AuthContext);

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
      </Routes>
    </>
  );
};

export default AppRouter;
