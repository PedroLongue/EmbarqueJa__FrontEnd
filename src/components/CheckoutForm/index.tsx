import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import Input from '../Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useState } from 'react';
import { formatDateToDDMMYYYY } from '../../utils/formatDate';

const CheckoutForm = () => {
  const passengers = useSelector((state: RootState) => state.search.passengers);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  console.log(currentUser);

  const [useBuyerInfo, setUseBuyerInfo] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState(
    Array.from({ length: passengers }).map((_, index) => ({
      name: '',
      cpf: '',
      birthDate: '',
    })),
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseBuyerInfo(event.target.checked);

    if (event.target.checked && currentUser) {
      setPassengerInfo((prev) => {
        const updated = [...prev];
        updated[0] = {
          name: currentUser.name || '',
          cpf: currentUser.cpf || '',
          birthDate: formatDateToDDMMYYYY(currentUser.birthDate) || '',
        };
        return updated;
      });
    } else {
      setPassengerInfo((prev) => {
        const updated = [...prev];
        updated[0] = { name: '', cpf: '', birthDate: '' };
        return updated;
      });
    }
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    setPassengerInfo((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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
              <Input
                fullWidth
                label="Nome do passageiro"
                variant="outlined"
                value={passengerInfo[index].name}
                onChange={(e) =>
                  handleInputChange(index, 'name', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                label="CPF"
                variant="outlined"
                value={passengerInfo[index].cpf}
                onChange={(e) =>
                  handleInputChange(index, 'cpf', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                label="Data de nascimento"
                variant="outlined"
                value={passengerInfo[index].birthDate}
                onChange={(e) =>
                  handleInputChange(index, 'birthDate', e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Grid>
  );
};

export default CheckoutForm;
