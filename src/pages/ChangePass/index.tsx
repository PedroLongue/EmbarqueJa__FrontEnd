import { Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import useChangePass from '../../hooks/useChangePass';
import CustomSnackbar from '../../components/CustomSnackbar';

const ChangePass = () => {
  const { changePassword, loading, error } = useChangePass();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('success');

  // Exibe o erro no Snackbar se houver
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
      // Faz a requisição para alterar a senha
      await changePassword(newsPass);

      // Limpa os campos apenas se a requisição for bem-sucedida
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // Exibe mensagem de sucesso
      setSnackbarMessage('Senha alterada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      // Em caso de erro, exibe a mensagem de erro no Snackbar
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        boxShadow: 3,
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: 'sm',
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
          value={password} // Adiciona o valor do estado
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Nova Senha"
          type="password"
          value={newPassword} // Adiciona o valor do estado
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Repetir Nova Senha"
          type="password"
          value={confirmNewPassword} // Adiciona o valor do estado
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button
          children="Salvar"
          variant="contained"
          sx={{ textTransform: 'none' }}
          type="submit"
          disabled={loading} // Desabilita o botão durante o carregamento
        />
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Container>
  );
};

export default ChangePass;
