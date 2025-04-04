import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

interface IReservation {
  _id: string;
  userId: string;
  ticketId: string;
  status: string;
}

const useReservations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReservation = async (
    userId: string,
    ticketId: string,
    seats: number[],
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<IReservation>('/tickets/reservations', {
        userId,
        ticketId,
        seats,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao criar reserva.');
      } else {
        setError('Erro ao criar reserva.');
      }
      throw err;
    }
  };

  const getPendingReservation = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<IReservation>(
        `/tickets/reservations/${userId}`,
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao buscar reserva.');
      } else {
        setError('Erro ao buscar reserva.');
      }
      throw err;
    }
  };

  const confirmReservation = async (reservationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch<IReservation>(
        `/reservations/${reservationId}/confirm`,
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao confirmar reserva.');
      } else {
        setError('Erro ao confirmar reserva.');
      }
      throw err;
    }
  };

  const cancelReservation = async (reservationId: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/tickets/reservations/${reservationId}`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao cancelar reserva.');
      } else {
        setError('Erro ao cancelar reserva.');
      }
      throw err;
    }
  };

  return {
    createReservation,
    getPendingReservation,
    confirmReservation,
    cancelReservation,
    loading,
    error,
  };
};

export default useReservations;
