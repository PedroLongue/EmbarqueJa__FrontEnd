import { useNavigate } from 'react-router';
import { ITicket } from '../types';
import { cancelUserReservation } from '../services/tickets';

interface UseCancelReservationProps {
  reservationId: string | null;
  setReservationId: (val: string | null) => void;
  setUserTicket: (val: ITicket | null) => void;
}

const useCancelReservation = () => {
  const navigate = useNavigate();

  const handleCancelReservation = async ({
    reservationId,
    setReservationId,
    setUserTicket,
  }: UseCancelReservationProps) => {
    if (!reservationId) return;

    try {
      await cancelUserReservation(reservationId);
      setUserTicket(null);
      setReservationId(null);
      navigate('/');
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  return { handleCancelReservation };
};

export default useCancelReservation;
