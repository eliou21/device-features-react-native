import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useSavedPosts } from '../context/SavedPostsContext';
import { Ionicons } from '@expo/vector-icons';
import EntryItem from '../components/EntryItem';

export default function SavedPostsScreen() {
  const { savedPosts, unsavePost } = useSavedPosts();
  const { theme } = useTheme();

  const sortedSavedPosts = React.useMemo(() => {
    console.log('Original saved posts:', savedPosts.map(p => ({ id: p.id, timestamp: p.timestamp })));
    const sorted = [...savedPosts].sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      console.log(`Comparing ${a.id} (${dateA}) with ${b.id} (${dateB})`);
      return dateB.getTime() - dateA.getTime();
    });
    console.log('Sorted saved posts:', sorted.map(p => ({ id: p.id, timestamp: p.timestamp })));
    return sorted;
  }, [savedPosts]);

  const renderEmptyState = () => (

    <View style={styles.emptyContainer}>

      <Ionicons 
        name="bookmark" 
        size={60} 
        color={theme === 'dark' ? '#F2E7DD' : '#847769'} 
        style={styles.emptyIcon}
      />
      
      <Text style={[styles.emptyText, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
        No saved posts yet
      </Text>

      <Text style={[styles.emptySubtext, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
        Save your favorite travel memories to find them here later
      </Text>

    </View>

  );

  return (

    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5EBE1' }]}>

      {sortedSavedPosts.length === 0 ? (
        renderEmptyState()

      ) : (

        <View style={styles.contentContainer}>

          <View style={styles.headerContainer}>

            <Ionicons 
              name="bookmark" 
              size={24} 
              color={theme === 'dark' ? '#F2E7DD' : '#847769'} 
              style={styles.headerIcon}
            />

            <Text style={[styles.headerText, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
              Your Saved Memories
            </Text>

          </View>
          
          <FlatList
            data={sortedSavedPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EntryItem
                entry={item}
                onRemove={() => unsavePost(item.id)}
                onPress={() => {}}
              />
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

  listContainer: {
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'serif',
  },

  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'serif',
    opacity: 0.8,
  },
  
}); 