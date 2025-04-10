import React, { useEffect, useState } from 'react';
import { 
  FlatList, 
  Text, 
  View, 
  StyleSheet,
  Image
} from 'react-native';
import { loadEntries, saveEntries } from '../utils/storage';
import { TravelEntry } from '../types/entry';
import EntryItem from '../components/EntryItem';
import { useTheme } from '../theme/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const isFocused = useIsFocused();
  const { theme } = useTheme();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const loaded = await loadEntries();
        setEntries(loaded);
      })();
    }
  }, [isFocused]);

  const removeEntry = async (id: string) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
    await saveEntries(updated);
  };

  return (

    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5EBE1' }]}>

      {entries.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Ionicons 
            name="camera" 
            size={60} 
            color={theme === 'dark' ? '#F2E7DD' : '#847769'} 
            style={styles.emptyIcon}
          />

          <Text style={[styles.emptyText, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
            No entries yet
          </Text>

          <Text style={[styles.emptySubtext, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
            Start your travel diary by adding your first entry
          </Text>

        </View>

      ) : (

        <View style={styles.contentContainer}>

          <View style={styles.headerContainer}>

            <Ionicons 
              name="book" 
              size={24} 
              color={theme === 'dark' ? '#F2E7DD' : '#847769'} 
              style={styles.headerIcon}
            />

            <Text style={[styles.headerText, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
              Your Adventry
            </Text>

          </View>

          <FlatList
            data={entries}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <EntryItem entry={item} onRemove={removeEntry} onPress={() => {}} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

        </View>

      )}

    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 119, 105, 0.2)',
  },

  headerIcon: {
    marginRight: 8,
  },

  headerText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'serif',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyIcon: {
    marginBottom: 20,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'serif',
    marginBottom: 8,
  },

  emptySubtext: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'serif',
    opacity: 0.8,
  },

  listContainer: {
    paddingBottom: 20,
  },
  
});
