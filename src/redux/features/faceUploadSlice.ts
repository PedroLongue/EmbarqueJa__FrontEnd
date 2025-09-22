import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FaceUploadState {
  images: (File | null)[];
}

const initialState: FaceUploadState = {
  images: [],
};

const faceUploadSlice = createSlice({
  name: 'faceUpload',
  initialState,
  reducers: {
    setFaceImage: (
      state,
      action: PayloadAction<{ index: number; file: File | null }>,
    ) => {
      const { index, file } = action.payload;
      state.images[index] = file;
    },
    setAllFaceImages: (state, action: PayloadAction<(File | null)[]>) => {
      state.images = action.payload;
    },
    resetFaceImages: (state) => {
      state.images = [];
    },
  },
});

export const { setFaceImage, setAllFaceImages, resetFaceImages } =
  faceUploadSlice.actions;

export default faceUploadSlice.reducer;
