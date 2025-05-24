import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { IAuthState } from '../../types';

const initialState: IAuthState = {
  user: localStorage.getItem('@Auth:token') || null,
  currentUser: null,
  signed: !!localStorage.getItem('@Auth:token'),
  authError: '',
};

// Thunk para obter usuário atual
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('users/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.errors[0] || 'Erro desconhecido',
      );
    }
  },
);

// Thunk para login
export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('@Auth:token', response.data.token);
      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.token}`;
      await dispatch(getCurrentUser());
      return response.data.token;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.errors[0] || 'Erro ao fazer login',
      );
    }
  },
);

// Thunk para cadastro
export const register = createAsyncThunk(
  'auth/register',
  async (
    {
      name,
      email,
      password,
      confirmPassword,
    }: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      await api.post('/users/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.errors[0] || 'Erro ao registrar',
      );
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      localStorage.clear();
      state.user = null;
      state.currentUser = null;
      state.signed = false;
    },
    loadCurrentUser: (state) => {
      const token = localStorage.getItem('@Auth:token');
      if (token) {
        state.user = token;
        state.signed = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.signed = true;
        state.authError = '';
      })
      .addCase(signIn.rejected, (state, action) => {
        state.authError = action.payload as string;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.currentUser = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.authError = action.payload as string;
      });
  },
});

export const { signOut, loadCurrentUser } = authSlice.actions;
export default authSlice.reducer;
