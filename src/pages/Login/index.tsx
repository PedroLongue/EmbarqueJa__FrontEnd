import { Container, Typography, Box, Link, Alert } from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, signed, authError, currentUser } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    await signIn(email, password);
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
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
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
              children="Cadastre-se"
              variant="outlined"
              sx={{ textTransform: 'none' }}
            />
            {authError && (
              <Typography variant="body1" align="center" color="#d34e4a">
                {authError}
              </Typography>
            )}
          </form>
        </Box>
      </Container>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default Login;
