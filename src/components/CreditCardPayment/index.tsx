import { Grid, Typography, Box } from '@mui/material';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import Input from '../Input';
import {
  formatCardNumber,
  formatCvv,
  formatExpiration,
} from '../../utils/inputMark';

const CreditCardPayment = () => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext();

  type Focused = 'number' | 'name' | 'expiry' | 'cvc' | undefined;
  const [focused, setFocused] = useState<Focused>(undefined);

  const cardNumber = watch('cardNumber') || '';
  const cardHolder = watch('cardHolder') || '';
  const expiration = watch('expiration') || '';
  const cvv = watch('cvv') || '';

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Cards
          number={cardNumber}
          name={cardHolder}
          expiry={expiration.replace('/', '')}
          cvc={cvv}
          focused={focused}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Dados do cartão
        </Typography>
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Número do cartão"
                {...register('cardNumber', {
                  required: 'Número do cartão é obrigatório',
                  pattern: {
                    value: /^[0-9 ]{13,25}$/,
                    message: 'Número do cartão inválido',
                  },
                })}
                onChange={(e) =>
                  setValue('cardNumber', formatCardNumber(e.target.value))
                }
                onFocus={() => setFocused('number')}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber?.message as string}
                datatestId="input-card-number"
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                fullWidth
                label="Nome do titular"
                {...register('cardHolder', {
                  required: 'Nome do titular é obrigatório',
                })}
                onFocus={() => setFocused('name')}
                error={!!errors.cardHolder}
                helperText={errors.cardHolder?.message as string}
                datatestId="input-card-name"
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
                onChange={(e) =>
                  setValue('expiration', formatExpiration(e.target.value))
                }
                onFocus={() => setFocused('expiry')}
                error={!!errors.expiration}
                helperText={errors.expiration?.message as string}
                datatestId="input-card-expiry"
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
                onChange={(e) => setValue('cvv', formatCvv(e.target.value))}
                onFocus={() => setFocused('cvc')}
                error={!!errors.cvv}
                helperText={errors.cvv?.message as string}
                datatestId="input-card-cvv"
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreditCardPayment;
