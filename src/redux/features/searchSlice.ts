import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Ticket {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  arrivalTime: string;
  departureTime: string;
  type: string;
  amenities: string[];
  company: string;
  companyLogo: string;
}

interface SearchState {
  origin: string;
  destination: string;
  departureDate: string;
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: SearchState = {
  origin: '',
  destination: '',
  departureDate: '',
  tickets: [],
  loading: false,
  error: null,
};

// Thunk para buscar as passagens
export const fetchTickets = createAsyncThunk(
  'search/fetchTickets',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { search: SearchState };
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

export const { setOrigin, setDestination, setDepartureDate } =
  searchSlice.actions;
export default searchSlice.reducer;
