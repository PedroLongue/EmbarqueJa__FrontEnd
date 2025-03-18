import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const useChangePass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (passwordData: IChangePasswordData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put('users/change-password', passwordData);

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

  return { changePassword, loading, error };
};

export default useChangePass;
