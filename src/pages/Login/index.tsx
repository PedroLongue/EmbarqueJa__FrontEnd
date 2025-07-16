import {
  Container,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useSelector } from 'react-redux';
import { signIn } from '../../redux/features/authSlice';
import { RootState } from '../../redux/store';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../components/CustomSnackbar';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import FaceRecognitionPopup from '../../components/FaceRecognitionPopup';
import useForgotPassword from '../../hooks/useForgotPassword';
import { SnackbarSeverity } from '../../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('error');
  const [popupOpen, setPopupOpen] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);

  const { signed, authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { forgotPassword, error, loading } = useForgotPassword();

  useEffect(() => {
    if (authError) {
      setSnackbarMessage(authError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    dispatch(signIn(user));

    if (authError) {
      setSnackbarMessage(authError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const resetPassword = async (email: string) => {
    if (!email) {
      setSnackbarMessage('Preencha o campo de e-mail.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const forgotPasswordRes = await forgotPassword(email);
      setSnackbarOpen(true);
      setSnackbarMessage(forgotPasswordRes.message);
      setSnackbarSeverity('success');
      setShowResetAlert(true);
    } catch (err) {
      setSnackbarOpen(true);
      setSnackbarMessage(error || 'Erro ao enviar e-mail.');
      setSnackbarSeverity('error');
    }
  };

  if (!signed) {
    return (
      <Container
        sx={{
          flex: '1',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
            boxShadow: 3,
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            maxWidth: 'sm',
            margin: '0 auto',
          }}
          maxWidth="sm"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              width: '100%',
            }}
          >
            <Typography variant="h3" align="center" fontWeight={'bold'}>
              Seja bem-vindo
            </Typography>
            <Typography variant="subtitle1" align="center">
              Faça login e escolha seu próximo destino!
            </Typography>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
              }}
            >
              <Input
                id="outlined-basic"
                label="E-mail"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
                datatestId="login-input-email"
              />
              <Input
                id="outlined-basic"
                label="Senha"
                variant="outlined"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                datatestId="login-input-password"
              />
              {showResetAlert && (
                <Alert
                  severity="info"
                  sx={{ width: '100%', alignItems: 'center' }}
                >
                  <Typography variant="body2" fontWeight="500">
                    Uma nova senha foi enviada ao seu e-mail. Use-a para entrar
                    e altere-a em "alterar senha".
                  </Typography>
                </Alert>
              )}

              <Button
                children={
                  loading ? (
                    <CircularProgress
                      sx={{
                        width: '20px !important',
                        height: '20px !important',
                      }}
                    />
                  ) : (
                    'Esqueci minha senha?'
                  )
                }
                variant="text"
                disabled={loading}
                onClick={() => {
                  resetPassword(email);
                }}
                sx={{ textTransform: 'none' }}
              />

              <Button
                children="Entrar"
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                type="submit"
                dataTestId="button-login"
              />
              <Button
                children="Entrar com reconhecimento facial"
                variant="contained"
                onClick={() => setPopupOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              />
              <FaceRecognitionPopup
                open={popupOpen}
                onClose={() => setPopupOpen(false)}
                mode="login"
              />

              <Link href="#" variant="body2" align="center" underline="none">
                {'Ainda não tem uma conta?'}
              </Link>
              <Button
                onClick={() => {
                  navigate('/register');
                }}
                children="Cadastre-se"
                variant="outlined"
                sx={{ textTransform: 'none' }}
              />
            </form>
          </Box>
          <CustomSnackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            severity={snackbarSeverity}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          />
        </Box>
      </Container>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default Login;
