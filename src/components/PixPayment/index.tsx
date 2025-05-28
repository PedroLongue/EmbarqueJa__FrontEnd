import { Box, CircularProgress, Grid, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import QRCode from 'react-qr-code';

import Button from '../Button';

const PixPayment = () => {
  const [status, setStatus] = useState<'inicial' | 'pending' | 'success'>(
    'inicial',
  );

  const payloadPixFake =
    '00020126580014BR.GOV.BCB.PIX0123teste@pix.com.br5204000053039865405100.005802BR5913Empresa XYZ6009Sao Paulo62110515PixExemplo1234567896304ABCD';

  const handlePayment = () => {
    setStatus('pending');
    setTimeout(() => {
      setStatus('success');
    }, 4000);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      {status === 'inicial' && (
        <>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Escaneie o QR Code abaixo para realizar o pagamento via Pix
          </Typography>
          <QRCode value={payloadPixFake} size={240} />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handlePayment}
            children="Já paguei"
          />
        </>
      )}

      {status === 'pending' && (
        <>
          <Typography variant="h6" gutterBottom>
            Aguardando confirmação do pagamento...
          </Typography>
          <CircularProgress sx={{ mt: 2 }} />
        </>
      )}

      {status === 'success' && (
        <Alert severity="success" sx={{ mt: 2, fontWeight: 'bold' }}>
          Pagamento via Pix confirmado com sucesso!
        </Alert>
      )}
    </Box>
  );
};

export default PixPayment;
