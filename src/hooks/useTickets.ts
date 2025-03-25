import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

interface ITicketData {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  type: string;
  amenities: string[];
  company: string;
  companyLogo: string;
  price: string;
}

const useTickets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTicket = async (ticketData: ITicketData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/tickets/create', ticketData);

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
