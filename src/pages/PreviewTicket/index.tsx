import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useGetTicket from '../../hooks/useGetTicket';
import useReservations from '../../hooks/useReservation';
import BoardingPass from './components/BoardingPass';
import CheckoutForm from './components/CheckoutForm';
import Timer from '../../components/Timer';
import useCancelReservation from '../../hooks/useCancelReservation';
import { ITicket } from '../../types';
import { useNavigate } from 'react-router';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { resetFaceImages } from '../../redux/features/faceUploadSlice';

const PreviewTicket = () => {
  const { ticket } = useGetTicket();
  const { getPendingReservation } = useReservations();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { handleCancelReservation } = useCancelReservation();

  useEffect(() => {
    const fetchReservation = async () => {
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
      } catch (error) {
        console.error('Erro ao buscar reserva:', error);
      }
    };

    fetchReservation();
  }, [currentUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
      <Timer
        onCancel={() => {
          handleCancelReservation({
            reservationId,
            setReservationId,
            setUserTicket,
          });
          dispatch(resetFaceImages());
        }}
      />
      <Grid container spacing={4}>
        {userTicket && (
          <>
            <CheckoutForm
              onFormChange={setFormValid}
              loadingImage={loadingImage}
              setLoadingImage={setLoadingImage}
            />
            <BoardingPass
              ticket={userTicket}
              loadingImage={loadingImage}
              onCancel={() => {
                handleCancelReservation({
                  reservationId,
                  setReservationId,
                  setUserTicket,
                });
                dispatch(resetFaceImages());
              }}
              isFormValid={formValid}
            />
          </>
        )}
      </Grid>
    </Container>
  );
};

export default PreviewTicket;
