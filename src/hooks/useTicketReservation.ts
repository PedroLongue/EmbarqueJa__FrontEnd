import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

interface ReserveSeatsResponse {
  success: boolean;
  message: string;
}

const useTicketReservation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const reserveSeats = async (
    ticketId: string,
    selectedSeats: number[],
  ): Promise<ReserveSeatsResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/tickets/${ticketId}/reserve`, {
        seats: selectedSeats,
      });

      setSuccess(true);

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.errors?.[0] || 'Erro ao reservar assentos.',
        );
      } else {
        setError('Erro ao reservar assentos.');
      }
      setSuccess(false);
      return { success: false, message: 'Erro ao reservar assentos.' };
    }
  };

  return { reserveSeats, loading, error, success };
};

export default useTicketReservation;
