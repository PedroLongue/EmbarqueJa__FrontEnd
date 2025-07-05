import { IChangePasswordData, IUserTicketData } from '../types';
import api from './api';

export const updateUserPassword = (data: IChangePasswordData) => {
  return api.put('users/change-password', data);
};

export const userForgotPassword = (email: string) => {
  return api.post('users/forgot-password', { email });
};

export const userUpdateProfile = (updateData: {
  cpf: string;
  birthDate: string;
}) => {
  return api.put('users/update-info', updateData);
};

export const userAddTicket = ({
  userId,
  ticketId,
  paymentMethod,
  userSeats,
}: IUserTicketData) => {
  return api.put<IUserTicketData>(`/users/add-user-ticket/${userId}`, {
    ticketId,
    paymentMethod,
    userSeats,
  });
};
