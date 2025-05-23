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
      console.log(action.payload);
      state.ticketId = action.payload;
    },
    setSeats: (state, action: PayloadAction<number[]>) => {
      state.seats = action.payload;
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
} = searchSlice.actions;
export default searchSlice.reducer;
