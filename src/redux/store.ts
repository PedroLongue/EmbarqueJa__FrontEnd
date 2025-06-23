import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import searchReducer from './features/searchSlice';
import faceUploadSlice from './features/faceUploadSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    faceUpload: faceUploadSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
