import {
  Avatar,
  Box,
  Container,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Logo from '../../assets/imgs/Header-logo.svg';
import { RootState } from '../../redux/store';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { signOut } from '../../redux/features/authSlice';
import { useState } from 'react';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signed, currentUser } = useSelector((state: RootState) => state.auth);

  console.log({ currentUser });

  const handleLogout = () => {
    dispatch(signOut());
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        <Container style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {signed && currentUser && (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
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
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                sx={{
                  width: '200px',
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/change-pass');
                  }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  Alterar senha
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/my-profile');
                  }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  Meu perfil
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/my-purchases');
                  }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  Minhas compras
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={handleClose}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Button
                    children="SAIR"
                    onClick={handleLogout}
                    variant="contained"
                    sx={{ width: '90px' }}
                  />
                </MenuItem>
              </Menu>
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
            </Box>
          )}
          {!signed && (
            <Button
              children="Entrar"
              onClick={() => navigate('/login')}
              variant="contained"
              sx={{ width: '150px', marginRight: '10px' }}
            />
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
