import {
  Avatar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(signOut());
    handleClose();
  };

  const renderUserMenu = () => (
    <Box display={'flex'} alignItems={'center'}>
      <Avatar
        alt={currentUser?.name}
        src=""
        sx={{ marginRight: '10px', bgcolor: '#1976d2', color: '#fff' }}
      >
        {currentUser?.name
          ?.split(' ')
          .map((n) => n[0]?.toUpperCase())
          .join('')}
      </Avatar>
      <Typography variant="body2" textTransform={'capitalize'} color="#000">
        Olá, {currentUser?.name?.split(' ')?.[0]}
      </Typography>
    </Box>
  );

  const drawerContent = (
    <Box sx={{ width: 250, padding: 2 }}>
      {signed && currentUser ? (
        <>
          {renderUserMenu()}
          <Divider sx={{ my: 2 }} />
          <MenuItem
            onClick={() => {
              navigate('/change-pass');
            }}
            sx={{ justifyContent: 'center' }}
          >
            Alterar senha
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/my-profile');
            }}
            sx={{ justifyContent: 'center' }}
          >
            Meu perfil
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/my-purchases');
            }}
            sx={{ justifyContent: 'center' }}
          >
            Minhas compras
          </MenuItem>
          {currentUser?.isAdmin && (
            <>
              <MenuItem
                onClick={() => {
                  navigate('/admin');
                }}
                sx={{ justifyContent: 'center' }}
              >
                Criar viagens
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate('/validate-passengers');
                }}
                sx={{ justifyContent: 'center' }}
              >
                Validar passageiros
              </MenuItem>
            </>
          )}
          <Button
            onClick={handleLogout}
            children="Sair"
            variant="contained"
            sx={{ width: '100%' }}
          />
        </>
      ) : (
        <Button
          fullWidth
          onClick={() => {
            navigate('/login');
          }}
          variant="contained"
        >
          Entrar
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <Container
        sx={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        maxWidth="xl"
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          height={'100%'}
          gap={2}
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ height: '100%', width: 'auto' }}
          />
          <Typography variant="body1" fontWeight="bold">
            EmbarqueJa
          </Typography>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={2}>
            {signed && currentUser ? (
              <>
                <Button
                  id="user-menu-button"
                  aria-controls={open ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  onClick={
                    handleClick
                  }
                >
                  {renderUserMenu()}
                </Button>
                <Menu
                  id="user-menu"
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
                  PaperProps={{
                    sx: {
                      padding: '10px',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/change-pass');
                    }}
                    sx={{ justifyContent: 'center' }}
                  >
                    Alterar senha
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/my-profile');
                    }}
                    sx={{ justifyContent: 'center' }}
                  >
                    Meu perfil
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/my-purchases');
                    }}
                    sx={{ justifyContent: 'center' }}
                  >
                    Minhas compras
                  </MenuItem>
                  {currentUser.isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate('/validate-passengers');
                      }}
                      sx={{ justifyContent: 'center' }}
                    >
                      Validar passageiros
                    </MenuItem>
                  )}
                  <Button
                    children="Sair"
                    variant="contained"
                    onClick={handleLogout}
                    sx={{ width: '100%' }}
                  />
                </Menu>
                {currentUser.isAdmin && (
                  <Button
                    children="Criar viagens"
                    onClick={() => {
                      navigate('/admin');
                    }}
                    variant="contained"
                    sx={{ width: '150px' }}
                  />
                )}
              </>
            ) : (
              <Button
                children="Entrar"
                onClick={() => {
                  navigate('/login');
                }}
                variant="contained"
                sx={{ width: '150px' }}
              />
            )}
          </Box>
        )}
      </Container>
      <Divider
        sx={{ backgroundColor: '#4A90E2', height: '2px', marginBottom: '40px' }}
      />
    </>
  );
};

export default Header;
