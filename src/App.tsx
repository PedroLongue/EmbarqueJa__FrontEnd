import AppRouter from './router';
import './global.css';
import { AuthProvider } from './context/auth';

function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}

export default App;
