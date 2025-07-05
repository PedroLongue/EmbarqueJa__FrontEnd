import { useState } from 'react';
import axios from 'axios';
import { IChangePasswordData } from '../types';
import { updateUserPassword } from '../services/user';

const useChangePass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (passwordData: IChangePasswordData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateUserPassword(passwordData);

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
