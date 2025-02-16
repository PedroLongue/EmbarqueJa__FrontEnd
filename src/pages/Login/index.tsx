import { Container, Typography, Box, Link } from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../components/CustomSnackbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('error');

  const { signIn, signed, authError, currentUser } = useContext(AuthContext);
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
    console.log(email, password);
    await signIn(email, password);

    if (authError) {
      setSnackbarMessage(authError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      ('');
    }
  };

  console.log(currentUser);
  if (!signed) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            />
            <Input
              id="outlined-basic"
              label="Senha"
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link href="#" variant="body2" align="center" underline="none">
              {'Esqueceu a senha?'}
            </Link>
            <Button
              children="Entrar"
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              type="submit"
            />
            <Button
              children="Entrar com FaceId"
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            />
            <Link href="#" variant="body2" align="center" underline="none">
              {'Ainda não tem uma conta?'}
            </Link>
            <Button
              onClick={() => navigate('/register')}
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
      </Container>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default Login;
