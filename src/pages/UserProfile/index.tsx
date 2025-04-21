import {
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Add, Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import CustomSnackbar from '../../components/CustomSnackbar';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';

const UserProfile = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const { updateProfile, loading, error } = useUpdateProfile();

  const [cpf, setCpf] = useState(currentUser?.cpf);
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<any>('success');

  useEffect(() => {
    if (currentUser) {
      setCpf(currentUser?.cpf || '');
      if (currentUser.birthDate?.includes('-')) {
        const formatedDate = formatDateToDDMMYYYY(currentUser.birthDate);
        setBirthDate(formatedDate);
      } else {
        setBirthDate(currentUser?.birthDate || '');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const update = {
      cpf,
      birthDate,
    };

    try {
      await updateProfile(update);

      setSnackbarMessage('Informações atualizadas!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(error || 'Erro ao alterar informações.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ flex: 1, mt: 4 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Meu perfil:
      </Typography>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Card
          sx={{ flex: 1, minWidth: 320, p: 2, borderRadius: 2, boxShadow: 3 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={'bold'}>
              Meus dados:
            </Typography>
            <Stack spacing={2}>
              <form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  width: '100%',
                }}
                onSubmit={handleUpdateProfile}
              >
                <Input
                  label="Nome"
                  value={currentUser?.name}
                  fullWidth
                  shrink={true}
                  disabled
                />
                <Input
                  label="E-mail"
                  value={currentUser?.email}
                  fullWidth
                  shrink={true}
                  disabled
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  children="Configurar FACEID"
                />
                <Input
                  label="Data de nascimento"
                  value={birthDate}
                  fullWidth
                  onChange={(e) => setBirthDate(e.target.value)}
                  shrink={birthDate ? true : false}
                  disabled={birthDate ? true : false}
                />
                <Input
                  label="CPF"
                  value={cpf}
                  fullWidth
                  onChange={(e) => setCpf(e.target.value)}
                  shrink={cpf ? true : false}
                  disabled={cpf ? true : false}
                />
                <Button
                  children="Salvar"
                  variant="contained"
                  sx={{ textTransform: 'none' }}
                  type="submit"
                  disabled={loading}
                />
              </form>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{ flex: 1, minWidth: 320, p: 2, borderRadius: 2, boxShadow: 3 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cartões salvos:
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f5f5f5"
              p={2}
              borderRadius={1}
              mb={2}
            >
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Crédito Nubank
                </Typography>
                <Typography fontWeight="bold">PEDRO LONGUE CORREA</Typography>
                <Typography>•••••••1234</Typography>
              </Box>
              <IconButton>
                <Delete />
              </IconButton>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f5f5f5"
              p={2}
              borderRadius={1}
              mb={2}
            >
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Crédito Bradesco
                </Typography>
                <Typography fontWeight="bold">PEDRO LONGUE CORREA</Typography>
                <Typography>•••••••1234</Typography>
              </Box>
              <IconButton>
                <Delete />
              </IconButton>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button variant="contained" color="primary" startIcon={<Add />}>
                Adicionar
              </Button>
            </Box>
          </CardContent>
        </Card>
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

export default UserProfile;
