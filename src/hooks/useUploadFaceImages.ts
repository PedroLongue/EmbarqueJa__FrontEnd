import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface PassengerInfo {
  name: string;
  cpf: string;
  birthDate: string;
  descriptor: number[];
}

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
          descriptor: passenger.descriptor,
        };

        uploadPromises.push(api.post('/face-passengers/upload', formData));
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
