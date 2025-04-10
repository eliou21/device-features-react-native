import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types/entry';

const STORAGE_KEY = 'travel_entries';

export const saveEntries = async (entries: TravelEntry[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const loadEntries = async (): Promise<TravelEntry[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
