import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { PassengerInfo } from '../types';
import { createFacePassenger } from '../services/facePassengers';

const useUploadFaceImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faceImages = useSelector((state: RootState) => state.faceUpload.images);

  const uploadFaceImages = async (
    ticketId: string,
    passengerInfos: PassengerInfo[],
  ) => {
    setLoading(true);
    setError(null);

    try {
      const uploadPromises: Promise<any>[] = [];

      passengerInfos.forEach((passenger, index) => {
        const imageFile = faceImages[index];

        if (!imageFile) return;

        const formData = {
          ticketId,
          name: passenger.name,
          cpf: passenger.cpf,
          birthDate: passenger.birthDate,
          descriptor: passenger.descriptor,
        };

        uploadPromises.push(createFacePassenger(formData));
      });

      await Promise.all(uploadPromises);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao enviar imagens.');
      } else {
        setError('Erro ao enviar imagens.');
      }
      throw err;
    }
  };

  return { uploadFaceImages, loading, error };
};

export default useUploadFaceImages;
