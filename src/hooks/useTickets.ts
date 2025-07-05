import { useState } from 'react';
import axios from 'axios';
import { ICreateTicketData } from '../types';
import { createNewTicket } from '../services/tickets';

const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (ticketData: ICreateTicketData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await await createNewTicket(ticketData);

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.errors?.[0] || 'Erro ao criar passagem.');
      } else {
        setError('Erro ao criar passagem.');
      }
      throw err;
    }
  };

  return { createTicket, loading, error };
};

export default useTickets;
