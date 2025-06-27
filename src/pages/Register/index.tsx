import { Container, Typography, Box, Link } from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../components/CustomSnackbar';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { register } from '../../redux/features/authSlice';
import { SnackbarSeverity } from '../../types';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('error');

  const { signed, authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      name,
      email,
      password,
      confirmPassword,
    };
    const result = await dispatch(register(user));

    if (register.fulfilled.match(result)) {
      navigate('/login');
    } else if (authError) {
      setSnackbarMessage(authError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
              Faça seu cadastro e escolha seu próximo destino!
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
                label="Nome Completo"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="outlined-basic"
                label="E-mail"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="outlined-basic"
                label="Senha"
                variant="outlined"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="outlined-basic"
                label="Confirmar Senha"
                variant="outlined"
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                children="Cadastrar"
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
                type="submit"
              />
              <Link href="#" variant="body2" align="center" underline="none">
                {'Já tem uma conta?'}
              </Link>
              <Button
                onClick={() => {
                  navigate('/login');
                }}
                children="Acesse sua conta"
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
