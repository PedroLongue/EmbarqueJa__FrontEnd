import { Container, Typography, Button } from '@mui/material';
import { useState } from 'react';
import ValidatePassengerPopup from '../../components/ValidatePassengerPopup';

const ValidatePassengers = () => {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
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
          Valide os passageiros da sua viagem
        </Typography>

        <Button variant="contained" onClick={() => setOpenPopup(true)}>
          Iniciar Validação Facial
        </Button>
      </Container>

      <ValidatePassengerPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
      />
    </>
  );
};

export default ValidatePassengers;
