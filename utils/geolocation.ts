import * as Location from 'expo-location';

export const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string> => {

  try {
    const address = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (address.length > 0) {
      const place = address[0];
      const parts = [
        place.name,
        place.street,
        place.district,
        place.city,
        place.region,
        place.country
      ].filter(Boolean);

      return parts.join(', ');
    }

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Error getting address:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
  
};
