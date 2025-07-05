export interface ITicket {
  _id: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  type: string;
  amenities: string[];
  company: string;
  companyLogo: string;
  price: number;
  __v: number;
  reservedSeats: number[];
  userSeats: number[];
}

export interface ISearchState {
  origin: string;
  destination: string;
  departureDate: string;
  tickets: ITicket[];
  passengers: number;
  seats: number[];
  loading: boolean;
  error: string | null;
  ticketId: string;
  passengerInfos: IPassengerInfos[];
}

interface IuserTrips {
  ticketId: string;
  paymentMethod: string;
  _id: string;
}

interface ICurrentUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  cpf: string;
  birthDate: string;
  userTickets: IuserTrips[];
  faceAuthDescriptor: boolean;
  __v: number;
}

export interface IAuthState {
  user: string | null;
  currentUser: ICurrentUser | null;
  signed: boolean;
  authError: string;
}

export interface IPassengerInfos {
  name: string;
  cpf: string;
  birthDate: string;
  descriptor: number[];
}

export type SnackbarSeverity = 'success' | 'info' | 'warning' | 'error';

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IUserTicketData {
  ticketId: string;
  paymentMethod: 'credit-card' | 'pix';
  userSeats: number[];
  userId: string;
}

export interface IReservation {
  _id: string;
  userId: string;
  ticketId: string;
  status: string;
}

export interface IConfirmReservation {
  _id: string;
  status: string;
  seats: number[];
}

export interface ISendTicket {
  email: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  seats: number[];
  passangers: {
    name: string;
    cpf: string;
  }[];
}

export interface ICreateTicketData {
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

export interface PassengerInfo {
  name: string;
  cpf: string;
  birthDate: string;
  descriptor: number[];
}
