import { IPassengerInfos } from '../types';
import api from './api';

export const createFacePassenger = async (formData: IPassengerInfos) => {
  return api.post('/face-passengers/upload', formData);
};
