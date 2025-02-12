import { Container, Divider, Typography } from '@mui/material';
import Logo from '../../assets/imgs/Header-logo.svg';

const index = () => {
  return (
    <>
      <Container
        sx={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
        maxWidth="xl"
      >
        <img src={Logo} alt="Logo" style={{ height: '100%', width: 'auto' }} />
        <Typography variant="body1" fontWeight={'bold'}>
          EmbarqueJa
        </Typography>
      </Container>
      <Divider
        sx={{ backgroundColor: '#4A90E2', height: '2px', marginBottom: '40px' }}
      />
    </>
  );
};

export default index;
