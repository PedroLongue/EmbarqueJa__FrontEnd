import { Container, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import ValidatePassengerPopup from '../../components/ValidatePassengerPopup';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const ValidatePassengers = () => {
  const [openPopup, setOpenPopup] = useState(false);

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
          gap: 3,
          boxShadow: 3,
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#ffffff',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        <VerifiedUserIcon sx={{ fontSize: 60, color: '#1976d2' }} />

        <Typography variant="h5" fontWeight="bold">
          Valide os passageiros da sua viagem
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          fontSize={{ xs: '0.9rem', sm: '1rem' }}
        >
          Utilize o reconhecimento facial para validar a identidade dos
          passageiros antes do embarque.
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpenPopup(true)}
          size="large"
          sx={{ minWidth: 220 }}
        >
          Iniciar Validação Facial
        </Button>
      </Box>

      <ValidatePassengerPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
      />
    </Container>
  );
};

export default ValidatePassengers;
