import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ISearchState } from '../../types';

// Estado inicial
const initialState: ISearchState = {
  origin: '',
  destination: '',
  departureDate: '',
  tickets: [],
  passengers: 1,
  ticketId: '',
  loading: false,
  error: null,
  seats: [],
  passengerInfos: [],
};

// Thunk para buscar as passagens
export const fetchTickets = createAsyncThunk(
  'search/fetchTickets',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { search: ISearchState };
    const { origin, destination, departureDate } = state.search;

    try {
      const response = await api.get(
        `/tickets/search?origin=${origin}&destination=${destination}&departureDate=${departureDate}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors || 'Erro desconhecido',
      );
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<string>) => {
      state.origin = action.payload;
    },
    setDestination: (state, action: PayloadAction<string>) => {
      state.destination = action.payload;
    },
    setDepartureDate: (state, action: PayloadAction<string>) => {
      state.departureDate = action.payload;
    },
    setPassengers: (state, action: PayloadAction<number>) => {
      state.passengers = action.payload;
    },
    setTicketId: (state, action: PayloadAction<string>) => {
      state.ticketId = action.payload;
    },
    setSeats: (state, action: PayloadAction<number[]>) => {
      state.seats = action.payload;
    },
    setPassengerInfos: (
      state,
      action: PayloadAction<{
        index: number;
        info: { name: string; cpf: string; birthDate: string };
      }>,
    ) => {
      const { index, info } = action.payload;
      const existing = state.passengerInfos[index];
      state.passengerInfos[index] = {
        ...info,
        descriptor: existing?.descriptor || [],
      };
    },
    setAllPassengerInfos: (
      state,
      action: PayloadAction<
        {
          name: string;
          cpf: string;
          birthDate: string;
          descriptor?: number[];
        }[]
      >,
    ) => {
      state.passengerInfos = action.payload.map((info) => ({
        ...info,
        descriptor: info.descriptor ?? [],
      }));
    },

    resetPassengerInfos: (state) => {
      state.passengerInfos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setOrigin,
  setDestination,
  setDepartureDate,
  setPassengers,
  setTicketId,
  setSeats,
  setPassengerInfos,
  setAllPassengerInfos,
  resetPassengerInfos,
} = searchSlice.actions;
export default searchSlice.reducer;
