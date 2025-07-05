import { useEffect, useState } from 'react';
import { getTickets } from '../services/tickets';

const useCities = (): string[] => {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getTickets();
        const tickets = response.data;

        const uniqueCities = [
          ...new Set(
            tickets.flatMap((ticket) => [ticket.origin, ticket.destination]),
          ),
        ];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      }
    };

    fetchCities();
  }, []);

  return cities;
};

export default useCities;
