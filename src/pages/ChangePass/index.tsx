import { Box, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useChangePass from '../../hooks/useChangePass';
import CustomSnackbar from '../../components/CustomSnackbar';
import { SnackbarSeverity } from '../../types';

const ChangePass = () => {
  const { changePassword, loading, error } = useChangePass();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const newsPass = {
      currentPassword: password,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    try {
      await changePassword(newsPass);

      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      setSnackbarMessage('Senha alterada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(error || 'Erro ao alterar senha.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
        <Typography variant="h4" align="center" fontWeight={'bold'}>
          Alterar Senha
        </Typography>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
          }}
          onSubmit={handlePasswordChange}
        >
          <Input
            label="Senha Atual"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Nova Senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Repetir Nova Senha"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <Button
            children="Salvar"
            variant="contained"
            sx={{ textTransform: 'none' }}
            type="submit"
            disabled={loading}
          />
        </form>

        <CustomSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </Box>
    </Container>
  );
};

export default ChangePass;
