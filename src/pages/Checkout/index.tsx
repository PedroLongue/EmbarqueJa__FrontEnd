import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Tab,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import useGetTicket from '../../hooks/useGetTicket';
import Timer from '../../components/Timer';
import useCancelReservation from '../../hooks/useCancelReservation';
import { ITicket } from '../../types';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [value, setValue] = useState('1');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);

  const { getPendingReservation, confirmReservation } = useReservations();
  const { handleCancelReservation } = useCancelReservation();
  const { ticket } = useGetTicket();
  const { createUserTicket, success } = useUserTickets();

  const methods = useForm({ mode: 'onBlur' });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onSubmit = async (data: any) => {
    if (!currentUser?._id) return;

    const paymentMethod = value === '1' ? 'credit-card' : 'pix';

    try {
      const reservation = await getPendingReservation(currentUser._id);
      if (reservation) {
        const confirmed = await confirmReservation(reservation._id);
        await createUserTicket(
          reservation.ticketId,
          paymentMethod,
          confirmed.seats,
          currentUser._id,
        );
      }

      await dispatch(getCurrentUser());
      navigate('/my-purchases');
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
    }
  };

  useEffect(() => {
    const loadReservation = async () => {
      if (!currentUser?._id) return;

      try {
        const reservation = await getPendingReservation(currentUser._id);
        if (reservation) {
          setReservationId(reservation._id);
          const ticketData = await ticket(reservation.ticketId);
          setUserTicket(ticketData);
        }
      } catch (err) {
        console.error('Erro ao carregar reserva:', err);
      }
    };

    loadReservation();
  }, [currentUser]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Timer
          onCancel={() =>
            handleCancelReservation({
              reservationId,
              setReservationId,
              setUserTicket,
            })
          }
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChangeTab} variant="fullWidth">
                  <Tab label="Cartão de Crédito" value="1" />
                  <Tab label="Pix" value="2" />
                </TabList>
              </Box>
              <Grid container spacing={2} mt={2}>
                <Grid item xs={12}>
                  <TabPanel value="1">
                    <CreditCardPayment />
                  </TabPanel>
                  <TabPanel value="2">
                    <PixPayment />
                  </TabPanel>
                </Grid>
              </Grid>

              <FormControlLabel
                sx={{ mt: 2 }}
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight="bold">
                    Concordo com a política de privacidade e os contratos de
                    transporte.
                  </Typography>
                }
              />
            </TabContext>
          </Card>

          <Box mt={3} textAlign="right">
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
