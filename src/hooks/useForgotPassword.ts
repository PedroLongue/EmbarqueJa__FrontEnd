import { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('users/forgot-password', { email });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.errors?.[0] || 'Erro ao enviar e-mail.');
      } else {
        setError('Erro ao enviar e-mail.');
      }
      throw err;
    }
  };

  return { forgotPassword, loading, error };
};

export default useForgotPassword;
