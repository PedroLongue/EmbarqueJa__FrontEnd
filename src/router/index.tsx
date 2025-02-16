import { Navigate, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Header from '../components/Header';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';
import Admin from '../pages/Admin';

const AppRouter = () => {
  const { signed, currentUser } = useContext(AuthContext);

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
