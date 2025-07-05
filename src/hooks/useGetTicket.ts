import { useState } from 'react';
import axios from 'axios';
import { getTicketById } from '../services/tickets';

const useGetTicket = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const ticket = async (ticketId: string) => {
    try {
      const response = await getTicketById(ticketId);
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
    }
  };
  return { ticket, error, success };
};

export default useGetTicket;
