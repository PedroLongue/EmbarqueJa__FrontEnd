import { useJsApiLoader } from '@react-google-maps/api';

export const useGoogleMapsLoader = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: ['geometry'],
  });
};
