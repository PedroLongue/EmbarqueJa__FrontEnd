import { useEffect } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import useRouteCalculator from '../../hooks/useRouteCalculator';
import { useGoogleMapsLoader } from '../../hooks/useGoogleMapsLoader';

interface MapProps {
  origin: string;
  destination: string;
}

const Map = ({ origin, destination }: MapProps) => {
  const { isLoaded } = useGoogleMapsLoader();
  const { route, originCoords, destinationCoords, loading, error, fetchRoute } =
    useRouteCalculator();

  useEffect(() => {
    if (isLoaded) {
      fetchRoute(origin, destination);
    }
  }, [isLoaded, origin, destination]);

  if (!isLoaded || loading || error) return;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: '300px',
        height: '200px',
        borderRadius: '12px',
      }}
      center={originCoords || { lat: -22.9068, lng: -43.1729 }}
      zoom={8}
    >
      {originCoords && <Marker position={originCoords} />}
      {destinationCoords && <Marker position={destinationCoords} />}

      {route.length > 0 && (
        <Polyline
          path={route}
          options={{
            strokeColor: '#1976d2',
            strokeOpacity: 2.0,
            strokeWeight: 5,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;
