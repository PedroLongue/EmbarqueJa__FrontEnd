import { Avatar, Box, Container, Divider, Typography } from '@mui/material';
import Logo from '../../assets/imgs/Header-logo.svg';
import { AuthContext } from '../../context/auth';
import { useContext } from 'react';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { signed, currentUser, singOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    singOut();
  };
  return (
    <>
      <Container
        sx={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
        maxWidth="xl"
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ height: '100%', width: 'auto', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
        <Typography variant="body1" fontWeight={'bold'}>
          EmbarqueJa
        </Typography>
        <Container>
          {signed && currentUser && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Avatar
                alt={currentUser.name}
                src={''}
                sx={{
                  marginRight: '10px',
                  bgcolor: '#1976d2',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0]?.toUpperCase())
                  .join('')}
              </Avatar>
              <Typography variant="body1" sx={{ width: '120px' }}>
                Olá, {currentUser.name.split(' ').shift()}
              </Typography>

              {currentUser.isAdmin && (
                <Button
                  children="Criar viagens"
                  onClick={() => navigate('/admin')}
                  variant="contained"
                  sx={{ width: '150px', marginRight: '10px' }}
                />
              )}
              <Button
                children="SAIR"
                onClick={handleLogout}
                variant="contained"
                sx={{ width: '90px' }}
              />
            </Box>
          )}
        </Container>
      </Container>
      <Divider
        sx={{ backgroundColor: '#4A90E2', height: '2px', marginBottom: '40px' }}
      />
    </>
  );
};

export default Header;
