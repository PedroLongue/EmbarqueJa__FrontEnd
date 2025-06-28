import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import QRCode from 'react-qr-code';

import Button from '../Button';
interface PixPaymentProps {
  handlePayment: () => void;
  status: 'inicial' | 'pending' | 'success';
}

const PixPayment: React.FC<PixPaymentProps> = ({ handlePayment, status }) => {
  const payloadPixFake =
    '00020126580014BR.GOV.BCB.PIX0123teste@pix.com.br5204000053039865405100.005802BR5913Empresa XYZ6009Sao Paulo62110515PixExemplo1234567896304ABCD';

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
            dataTestId="confirm-pix-payment"
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
