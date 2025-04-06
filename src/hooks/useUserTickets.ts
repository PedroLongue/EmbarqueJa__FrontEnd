import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

interface IUserTicketData {
  ticketId: string;
  paymentMethod: 'credit-card' | 'pix';
  userSeats: number[];
  userId: string;
}

const useUserTickets = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUserTicket = async (
    ticketId: string,
    paymentMethod: 'credit-card' | 'pix',
    userSeats: number[],
    userId: string,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.put<IUserTicketData>(
        `/users/add-user-ticket/${userId}`,
        {
          ticketId,
          paymentMethod,
          userSeats,
        },
      );

      setLoading(false);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.errors?.[0] || 'Erro ao criar passagem.');
      } else {
        setError('Erro ao criar passagem.');
      }
      throw err;
    }
  };

  return { createUserTicket, loading, error, success };
};

export default useUserTickets;
