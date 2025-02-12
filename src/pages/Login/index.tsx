import { Container, Typography, Box, Link } from '@mui/material';
import Button from '../../components/Button';
import Input from '../../components/Input';

const Login = () => {
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
        <Input id="outlined-basic" label="E-mail" variant="outlined" />
        <Input
          id="outlined-basic"
          label="Senha"
          variant="outlined"
          type="password"
        />
        <Link href="#" variant="body2" align="center" underline="none">
          {'Esqueceu a senha?'}
        </Link>
        <Button
          children="Entrar"
          variant="contained"
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
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
      </Box>
    </Container>
  );
};

export default Login;
