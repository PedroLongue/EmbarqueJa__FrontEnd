import {
  Container,
  Typography,
  Box,
  Divider,
  Stack,
  Alert,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

const ValidateFromQrCode = () => {
  const [params] = useSearchParams();

  const data = useMemo(() => {
    const origin = params.get('origin') || '';
    const destination = params.get('destination') || '';
    const departureDate = params.get('departureDate') || '';
    const departureTime = params.get('departureTime') || '';
    const seats = params.get('seats')?.split(',') || [];
    const passengers = JSON.parse(params.get('passengers') || '[]');

    return {
      origin,
      destination,
      departureDate,
      departureTime,
      seats,
      passengers,
    };
  }, [params]);

  return (
    <Container sx={{ flex: 1 }}>
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
          maxWidth: 520,
          width: '100%',
          textAlign: 'center',
          margin: '40px auto',
        }}
      >
        <QrCodeScannerIcon sx={{ fontSize: 60, color: '#1976d2' }} />

        <Typography variant="h5" fontWeight="bold">
          Passagem identificada com sucesso!
        </Typography>

        <Alert severity="success" sx={{ width: '100%' }}>
          QR Code válido. Dados da viagem encontrados.
        </Alert>

        <Divider sx={{ width: '100%' }} />

        <Stack spacing={1} sx={{ textAlign: 'left', width: '100%' }}>
          <Typography>
            <strong>Origem:</strong> {data.origin}
          </Typography>
          <Typography>
            <strong>Destino:</strong> {data.destination}
          </Typography>
          <Typography>
            <strong>Data:</strong>{' '}
            {new Date(data.departureDate).toLocaleDateString('pt-BR')}
          </Typography>
          <Typography>
            <strong>Horário:</strong> {data.departureTime}
          </Typography>
          <Typography>
            <strong>Assento(s):</strong> {data.seats.join(', ')}
          </Typography>

          <Typography>
            <strong>Passageiro(s):</strong>
          </Typography>
          <ul style={{ marginTop: 0, paddingLeft: '1rem' }}>
            {data.passengers.map((p: any, idx: number) => (
              <li key={idx}>
                {p.name} - CPF: {p.cpf}
              </li>
            ))}
          </ul>
        </Stack>
      </Box>
    </Container>
  );
};

export default ValidateFromQrCode;
