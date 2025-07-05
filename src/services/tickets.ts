import {
  IConfirmReservation,
  ICreateTicketData,
  IReservation,
  ISendTicket,
} from '../types';
import api from './api';

interface Ticket {
  origin: string;
  destination: string;
}

export const getTickets = () => {
  return api.get<Ticket[]>('/tickets');
};

export const getTicketById = (ticketId: string) => {
  return api.get(`/tickets/${ticketId}`);
};

export const createNewReservation = (
  userId: string,
  ticketId: string,
  seats: number[],
) => {
  return api.post('/tickets/reservations', {
    userId,
    ticketId,
    seats,
  });
};

export const getReservationByUser = (userId: string) => {
  return api.get<IReservation>(`/tickets/reservations/${userId}`);
};

export const confirmUserReservation = (reservationId: string) => {
  return api.patch<IConfirmReservation>(
    `/tickets/reservations/${reservationId}/confirm`,
  );
};

export const cancelUserReservation = (reservationId: string) => {
  return api.delete(`/tickets/reservations/${reservationId}`);
};

export const sendTicket = ({
  email,
  origin,
  destination,
  departureDate,
  departureTime,
  seats,
  passangers,
}: ISendTicket) => {
  return api.post('tickets/senderTicket', {
    email,
    origin,
    destination,
    departureDate,
    departureTime,
    seats,
    passangers,
  });
};

export const createNewTicket = (ticketData: ICreateTicketData) => {
  return api.post('/tickets/create', ticketData);
};
