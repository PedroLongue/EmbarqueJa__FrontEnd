// CheckoutForm.tsx
import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import Input from '../Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';
import { useForm, Controller, useFormContext } from 'react-hook-form';

type PassengerInfo = {
  name: string;
  cpf: string;
  birthDate: string;
};

interface CheckoutFormProps {
  onFormChange: (isValid: boolean) => void;
}

const CheckoutForm = ({ onFormChange }: CheckoutFormProps) => {
  const passengers = useSelector((state: RootState) => state.search.passengers);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [useBuyerInfo, setUseBuyerInfo] = useState(false);

  const {
    control,
    setValue,
    getValues,
    trigger,
    formState: { isValid },
  } = useForm<{ passengers: PassengerInfo[] }>({
    mode: 'onChange',
    defaultValues: {
      passengers: Array.from({ length: passengers }).map(() => ({
        name: '',
        cpf: '',
        birthDate: '',
      })),
    },
  });

  useEffect(() => {
    onFormChange(isValid);
  }, [isValid, onFormChange]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseBuyerInfo(event.target.checked);

    if (event.target.checked && currentUser) {
      setValue(`passengers.0`, {
        name: currentUser.name || '',
        cpf: currentUser.cpf || '',
        birthDate: formatDateToDDMMYYYY(currentUser.birthDate) || '',
      });
    } else {
      setValue(`passengers.0`, {
        name: '',
        cpf: '',
        birthDate: '',
      });
    }

    trigger();
  };

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
              control={
                <Checkbox
                  checked={useBuyerInfo}
                  onChange={handleCheckboxChange}
                />
              }
              label="Sou o comprador da viagem e também um dos passageiros."
            />
          )}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Controller
                name={`passengers.${index}.name`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="Nome do passageiro"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`passengers.${index}.cpf`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="CPF"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`passengers.${index}.birthDate`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    shrink={useBuyerInfo}
                    fullWidth
                    label="Data de nascimento"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default CheckoutForm;
