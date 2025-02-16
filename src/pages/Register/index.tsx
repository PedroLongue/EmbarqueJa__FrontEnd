import { Container, Typography, Box, Link } from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, signed, authError } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    await register(name, email, password, confirmPassword);
  };

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
            Faça seu cadastro e escolha seu próximo destino!
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
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
              onClick={() => navigate('/login')}
              children="Acesse sua conta"
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
