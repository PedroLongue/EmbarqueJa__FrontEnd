import { useState } from 'react';
import axios from 'axios';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

const useRouteCalculator = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [route, setRoute] = useState<LatLngLiteral[]>([]);
  const [originCoords, setOriginCoords] = useState<LatLngLiteral | null>(null);
  const [destinationCoords, setDestinationCoords] =
    useState<LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = async (
    address: string,
  ): Promise<LatLngLiteral | null> => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ address });
      if (response.results[0]?.geometry?.location) {
        const { lat, lng } = response.results[0].geometry.location;
        return { lat: lat(), lng: lng() };
      }
      throw new Error('Endereço não encontrado');
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      setError('Erro ao buscar coordenadas');
      return null;
    }
  };

  const calculateRoute = async (
    origin: LatLngLiteral,
    destination: LatLngLiteral,
  ) => {
    try {
      const response = await axios.post(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          origin: {
            location: {
              latLng: { latitude: origin.lat, longitude: origin.lng },
            },
          },
          destination: {
            location: {
              latLng: { latitude: destination.lat, longitude: destination.lng },
            },
          },
          travelMode: 'DRIVE',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey || '',
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
          },
        },
      );

      const polyline = response.data.routes[0].polyline.encodedPolyline;
      const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
      setRoute(decodedPath as any);
    } catch (error) {
      console.error('Erro ao calcular a rota:', error);
      setError('Erro ao calcular a rota');
    }
  };

  const fetchRoute = async (origin: string, destination: string) => {
    setLoading(true);
    setError(null);

    const originLatLng = await getCoordinates(origin);
    const destinationLatLng = await getCoordinates(destination);

    if (originLatLng && destinationLatLng) {
      setOriginCoords(originLatLng);
      setDestinationCoords(destinationLatLng);
      await calculateRoute(originLatLng, destinationLatLng);
    } else {
      setError('Coordenadas de origem ou destino não encontradas');
    }

    setLoading(false);
  };

  return {
    route,
    originCoords,
    destinationCoords,
    loading,
    error,
    fetchRoute,
  };
};

export default useRouteCalculator;
