import { Box, Grid, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import Input from '../Input';

const CreditCardPayment = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid item xs={12} md={6}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Cartão de crédito
      </Typography>
      <Box border={1} borderColor="divider" borderRadius={2} p={2} mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              fullWidth
              label="Número do cartão"
              {...register('cardNumber', {
                required: 'Número do cartão é obrigatório',
                pattern: {
                  value: /^[0-9]{13,19}$/,
                  message: 'Número do cartão inválido',
                },
              })}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              fullWidth
              label="Nome do titular"
              {...register('cardHolder', {
                required: 'Nome do titular é obrigatório',
              })}
              error={!!errors.cardHolder}
              helperText={errors.cardHolder?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              fullWidth
              label="CPF"
              {...register('cpf', {
                required: 'CPF é obrigatório',
                pattern: {
                  value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                  message: 'CPF inválido (use o formato 000.000.000-00)',
                },
              })}
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              fullWidth
              label="CVV"
              {...register('cvv', {
                required: 'CVV é obrigatório',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: 'CVV inválido',
                },
              })}
              error={!!errors.cvv}
              helperText={errors.cvv?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              fullWidth
              label="Data de validade"
              placeholder="MM/AA"
              {...register('expiration', {
                required: 'Data de validade é obrigatória',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Data inválida (use MM/AA)',
                },
              })}
              error={!!errors.expiration}
              helperText={errors.expiration?.message}
            />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default CreditCardPayment;
