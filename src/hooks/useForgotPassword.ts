import { useState } from 'react';
import axios from 'axios';
import { userForgotPassword } from '../services/user';

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userForgotPassword(email);
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
