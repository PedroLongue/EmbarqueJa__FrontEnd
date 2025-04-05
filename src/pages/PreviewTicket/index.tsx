import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useGetTicket from '../../hooks/useGetTicket';
import useReservations from '../../hooks/useReservation';
import BoardingPass from '../../components/BoardingPass';
import CheckoutForm from '../../components/CheckoutForm';
import { useNavigate } from 'react-router';
import Timer from '../../components/Timer';

interface ITicket {
  _id: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  type: string;
  amenities: string[];
  company: string;
  companyLogo: string;
  price: number;
  __v: number;
  reservedSeats: number[];
}

const PreviewTicket = () => {
  const navigate = useNavigate();
  const { ticket } = useGetTicket();
  const { getPendingReservation, cancelReservation } = useReservations();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!currentUser?._id) return;

      try {
        const reservation = await getPendingReservation(currentUser._id);
        if (reservation) {
          setReservationId(reservation._id);
          const ticketData = await ticket(reservation.ticketId);
          setUserTicket(ticketData);
        }
      } catch (error) {
        console.error('Erro ao buscar reserva:', error);
      }
    };

    fetchReservation();
  }, [currentUser]);

  const handleCancelReservation = async () => {
    if (!reservationId) return;

    try {
      await cancelReservation(reservationId);
      setUserTicket(null);
      setReservationId(null);
      navigate('/');
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
      <Timer onCancel={handleCancelReservation} />
      <Grid container spacing={4}>
        <CheckoutForm onFormChange={setFormValid} />
        {userTicket && (
          <BoardingPass
            ticket={userTicket}
            onCancel={handleCancelReservation}
            isFormValid={formValid}
          />
        )}
      </Grid>
    </Container>
  );
};

export default PreviewTicket;
