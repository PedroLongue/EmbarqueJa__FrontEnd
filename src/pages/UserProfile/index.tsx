import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Button from '../../components/Button';
import Input from '../../components/Input';
import useUpdateProfile from '../../hooks/useUpdateProfile';
import CustomSnackbar from '../../components/CustomSnackbar';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';
import FaceRecognitionPopup from '../../components/FaceRecognitionPopup';
import { formatCPF, formatDate } from '../../utils/inputMark';
import { SnackbarSeverity } from '../../types';

const UserProfile = () => {
  const { currentUser } = useSelector(
    (state: RootState) => state.auth as RootState['auth'],
  );

  const { updateProfile, loading, error } = useUpdateProfile();

  const [cpf, setCpf] = useState(currentUser?.cpf);
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  const [popupOpen, setPopupOpen] = useState(false);

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
    <Container sx={{ flex: 1 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom data-testid="my-profile-title">
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
                  disabled={currentUser?.faceAuthDescriptor}
                  onClick={() => setPopupOpen(true)}
                  children="Configurar FaceRecognition"
                />
                <FaceRecognitionPopup
                  open={popupOpen}
                  onClose={() => setPopupOpen(false)}
                  mode="register"
                />

                <Input
                  label="Data de nascimento"
                  value={birthDate}
                  fullWidth
                  onChange={(e) => setBirthDate(formatDate(e.target.value))}
                  shrink={birthDate ? true : false}
                  disabled={!!currentUser?.birthDate}
                />
                <Input
                  label="CPF"
                  value={cpf}
                  fullWidth
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  shrink={cpf ? true : false}
                  disabled={!!currentUser?.cpf}
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
