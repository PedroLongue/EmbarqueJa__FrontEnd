import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
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
import useSendTicket from '../../hooks/useSendTicket';
import Button from '../../components/Button';
import useUploadFaceImages from '../../hooks/useUploadFaceImages';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [value, setValue] = useState('1');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(false);

  const { uploadFaceImages } = useUploadFaceImages();
  const faceImages = useSelector((state: RootState) => state.faceUpload.images);
  const passengerInfos = useSelector(
    (state: RootState) => state.search.passengerInfos,
  );

  console.log('faceImages:', faceImages);
  console.log('passengerInfos:', passengerInfos);

  const { getPendingReservation, confirmReservation } = useReservations();
  const { handleCancelReservation } = useCancelReservation();
  const { ticket } = useGetTicket();
  const { createUserTicket } = useUserTickets();
  const { sendUserTicket } = useSendTicket();

  const methods = useForm({ mode: 'onBlur' });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const onSubmit = async () => {
    if (!currentUser?._id) return;

    const paymentMethod = value === '1' ? 'credit-card' : 'pix';

    try {
      setLoading(true);
      const reservation = await getPendingReservation(currentUser._id);
      if (reservation) {
        const confirmed = await confirmReservation(reservation._id);

        if (
          passengerInfos.some(
            (p) => Array.isArray(p.descriptor) && p.descriptor.length > 0,
          )
        ) {
          await uploadFaceImages(reservation.ticketId, passengerInfos);
        }

        await createUserTicket(
          reservation.ticketId,
          paymentMethod,
          confirmed.seats,
          currentUser._id,
        );

        await sendUserTicket({
          email: currentUser.email,
          origin: userTicket?.origin ?? '',
          destination: userTicket?.destination ?? '',
          departureDate: userTicket?.departureDate ?? '',
          departureTime: userTicket?.departureTime ?? '',
          seats: confirmed.seats ?? [],
        });

        await dispatch(getCurrentUser());
        navigate('/my-purchases');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erro ao finalizar compra:', err);
    }
  };

  useEffect(() => {
    const loadReservation = async () => {
      if (!currentUser?._id) return;

      try {
        const reservation = await getPendingReservation(currentUser._id);
        console.log('Reservation:', reservation);
        if (reservation) {
          setReservationId(reservation._id);
          const ticketData = await ticket(reservation.ticketId);
          setUserTicket(ticketData);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Erro ao carregar reserva:', err);
      }
    };

    loadReservation();
  }, [currentUser]);

  const [pixStatus, setPixStatus] = useState<'inicial' | 'pending' | 'success'>(
    'inicial',
  );

  const handlePixPayment = () => {
    setPixStatus('pending');
    setTimeout(() => {
      setPixStatus('success');
    }, 2000);
  };

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
                    <PixPayment
                      handlePayment={handlePixPayment}
                      status={pixStatus}
                    />
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

          <Box
            mt={3}
            display={'flex'}
            justifyContent={'flex-end'}
            gap={2}
            textAlign="right"
          >
            <Button
              variant="contained"
              onClick={() => {
                handleCancelReservation({
                  reservationId,
                  setReservationId,
                  setUserTicket,
                });
              }}
              color="error"
              children="Cancelar reserva"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              children={
                loading ? (
                  <CircularProgress
                    sx={{
                      width: '20px !important',
                      height: '20px !important',
                    }}
                  />
                ) : (
                  'Finalizar compra'
                )
              }
              disabled={
                !acceptedTerms ||
                (value === '1' && !isValid) ||
                pixStatus === 'pending' ||
                pixStatus === 'inicial' ||
                loading
              }
            />
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
};

export default Checkout;
