import { useState } from 'react';
import api from '../services/api';
import axios from 'axios';

interface IUpdateDate {
  cpf: string | null | undefined;
  birthDate: string | null | undefined;
}

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (updateData: IUpdateDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put('users/update-info', updateData);

      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.errors?.[0] || 'Erro ao alterar a senha.');
      } else {
        setError('Erro ao alterar a senha.');
      }
      throw err;
    }
  };

  return { updateProfile, loading, error };
};

export default useUpdateProfile;
