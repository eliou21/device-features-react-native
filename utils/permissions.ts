import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const requestAllPermissions = async () => {
  await Notifications.requestPermissionsAsync();
};
