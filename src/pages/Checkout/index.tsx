import { Card, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getCurrentUser } from '../../redux/features/authSlice';
import useUserTickets from '../../hooks/useUserTickets';
import useReservations from '../../hooks/useReservation';
import useCancelReservation from '../../hooks/useCancelReservation';
import useGetTicket from '../../hooks/useGetTicket';
import useSendTicket from '../../hooks/useSendTicket';
import useUploadFaceImages from '../../hooks/useUploadFaceImages';
import Timer from '../../components/Timer';
import PaymentTabs from './components/PaymentTabs';
import TermsCheckbox from './components/TermsCheckbox';
import ActionButtons from './components/ActionButtons';
import { ITicket } from '../../types';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const passengerInfos = useSelector(
    (state: RootState) => state.search.passengerInfos,
  );

  const [value, setValue] = useState('1');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [pixStatus, setPixStatus] = useState<'inicial' | 'pending' | 'success'>(
    'inicial',
  );

  console.log({ passengerInfos });

  const methods = useForm({ mode: 'onBlur' });
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { getPendingReservation, confirmReservation } = useReservations();
  const { handleCancelReservation } = useCancelReservation();
  const { ticket } = useGetTicket();
  const { createUserTicket } = useUserTickets();
  const { sendUserTicket } = useSendTicket();
  const { uploadFaceImages } = useUploadFaceImages();

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handlePixPayment = () => {
    setPixStatus('pending');
    setTimeout(() => {
      setPixStatus('success');
    }, 2000);
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

        await createUserTicket({
          ticketId: reservation.ticketId,
          paymentMethod,
          userSeats: confirmed.seats,
          userId: currentUser._id,
        });

        await sendUserTicket({
          email: currentUser.email,
          origin: userTicket?.origin ?? '',
          destination: userTicket?.destination ?? '',
          departureDate: userTicket?.departureDate ?? '',
          departureTime: userTicket?.departureTime ?? '',
          seats: confirmed.seats ?? [],
          passangers: passengerInfos.map((p) => ({
            name: p.name,
            cpf: p.cpf,
          })),
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
            <PaymentTabs
              value={value}
              onChange={handleChangeTab}
              pixStatus={pixStatus}
              handlePixPayment={handlePixPayment}
            />
            <TermsCheckbox
              accepted={acceptedTerms}
              onChange={setAcceptedTerms}
            />
          </Card>
          <ActionButtons
            loading={loading}
            acceptedTerms={acceptedTerms}
            isValid={isValid}
            paymentMethod={value === '1' ? 'credit-card' : 'pix'}
            pixStatus={pixStatus}
            onCancel={() =>
              handleCancelReservation({
                reservationId,
                setReservationId,
                setUserTicket,
              })
            }
          />
        </form>
      </Container>
    </FormProvider>
  );
};

export default Checkout;
