import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import Input from '../Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const CheckoutForm = () => {
  const passengers = useSelector((state: RootState) => state.search.passengers);
  return (
    <Grid item xs={12} md={7}>
      {Array.from({ length: passengers }).map((_, index) => (
        <Box
          key={index}
          sx={{
            mb: 3,
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            backgroundColor: '#F8F9FA',
          }}
        >
          {index === 0 && (
            <FormControlLabel
              control={<Checkbox />}
              label="Sou o comprador da viagem e também um dos passageiros."
            />
          )}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Input fullWidth label="Nome do passageiro" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <Input fullWidth label="CPF" variant="outlined" />
            </Grid>
            <Grid item xs={6}>
              <Input fullWidth label="Data de nascimento" variant="outlined" />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default CheckoutForm;
