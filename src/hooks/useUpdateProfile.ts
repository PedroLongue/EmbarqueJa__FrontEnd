import { useState } from 'react';
import axios from 'axios';
import { userUpdateProfile } from '../services/user';

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
      const response = await userUpdateProfile({
        cpf: updateData.cpf ?? '',
        birthDate: updateData.birthDate ?? '',
      });

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
