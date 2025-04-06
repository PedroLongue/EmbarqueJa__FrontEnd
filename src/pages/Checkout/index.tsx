import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  Tab,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CreditCardPayment from '../../components/CreditCardPayment';
import PixPayment from '../../components/PixPayment';
import { useForm, FormProvider } from 'react-hook-form';
import useUserTickets from '../../hooks/useUserTickets';
import useReservations from '../../hooks/useReservation';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../../redux/features/authSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { getPendingReservation, confirmReservation } = useReservations();
  const [value, setValue] = useState('1');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { createUserTicket, success } = useUserTickets();

  const methods = useForm({
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  console.log(currentUser?._id);

  const onSubmit = async (data: any) => {
    if (!currentUser?._id) return;

    const paymentMethod = value === '1' ? 'credit-card' : 'pix';
    const fullData = {
      ...data,
      paymentMethod,
    };

    try {
      const reservation = await getPendingReservation(currentUser._id);
      if (reservation) {
        const confirmedReservation = await confirmReservation(reservation._id);
        console.log(confirmedReservation.seats);
        await createUserTicket(
          reservation.ticketId,
          paymentMethod,
          confirmedReservation.seats,
          currentUser._id,
        );
      }
      await dispatch(getCurrentUser());
      navigate('/my-purchases');
    } catch (error) {
      console.log(error);
    }
    console.log({ success });

    console.log(fullData);
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 4, borderRadius: 2 }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChangeTab}
                  aria-label="Métodos de pagamento"
                  variant="fullWidth"
                  sx={{ width: '100%' }}
                >
                  <Tab
                    sx={{ flex: 1, fontWeight: 'bold' }}
                    label="Cartão de Crédito"
                    value="1"
                  />
                  <Tab
                    sx={{ flex: 1, fontWeight: 'bold' }}
                    label="Pix"
                    value="2"
                  />
                </TabList>
              </Box>

              <TabPanel value="1">
                <CreditCardPayment />
              </TabPanel>
              <TabPanel value="2">
                <PixPayment />
              </TabPanel>
            </TabContext>

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
              }
              sx={{ mt: 2 }}
              label={
                <Typography fontWeight="bold">
                  Ao realizar a compra, você concorda com a política de
                  privacidade e os contratos de transporte rodoviário.
                </Typography>
              }
            />
          </Card>

          <Box mt={4} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!acceptedTerms || (value === '1' && !isValid)}
            >
              Finalizar compra
            </Button>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
};

export default Checkout;
