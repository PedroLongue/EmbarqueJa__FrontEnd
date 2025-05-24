import { useNavigate } from 'react-router';
import useReservations from './useReservation';
import { ITicket } from '../types';

interface UseCancelReservationProps {
  reservationId: string | null;
  setReservationId: (val: string | null) => void;
  setUserTicket: (val: ITicket | null) => void;
}

const useCancelReservation = () => {
  const navigate = useNavigate();
  const { cancelReservation } = useReservations();

  const handleCancelReservation = async ({
    reservationId,
    setReservationId,
    setUserTicket,
  }: UseCancelReservationProps) => {
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

  return { handleCancelReservation };
};

export default useCancelReservation;
