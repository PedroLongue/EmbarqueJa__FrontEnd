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
