import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { ISendTicket } from '../types';
import { sendTicket } from '../services/tickets';

const useSendTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUserTicket = async ({
    email,
    origin,
    destination,
    departureDate,
    departureTime,
    seats,
    passangers,
  }: ISendTicket) => {
    setLoading(true);
    setError(null);

    try {
      const response = await sendTicket({
        email,
        origin,
        destination,
        departureDate,
        departureTime,
        seats,
        passangers,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.errors?.[0] || 'Erro ao enviar e-mail.');
      } else {
        setError('Erro ao enviar e-mail.');
      }
      throw err;
    }
  };

  return { sendUserTicket, loading, error };
};

export default useSendTicket;
