import QrCode from '../../assets/imgs/qrCode.png';
import { Grid } from '@mui/material';

const PixPayment = () => {
  return (
    <Grid
      item
      xs={12}
      md={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <img src={QrCode} alt="PIX" style={{ width: 300 }} />
    </Grid>
  );
};

export default PixPayment;
