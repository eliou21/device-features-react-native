import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';

export const requestAllPermissions = async () => {
  await ImagePicker.requestCameraPermissionsAsync();
  await Location.requestForegroundPermissionsAsync();
  await Notifications.requestPermissionsAsync();
};
