import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Dimensions,
  Animated,
  Share,
} from 'react-native';
import { TravelEntry } from '../types/entry';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useSavedPosts } from '../context/SavedPostsContext';
import { useLikedPosts } from '../context/LikedPostsContext';

type Props = {
  entry: TravelEntry;
  onRemove: (id: string) => void;
  onPress: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EntryItem({ entry, onRemove, onPress }: Props) {
  const { theme } = useTheme();
  const { savePost, unsavePost, isPostSaved } = useSavedPosts();
  const { isLiked, toggleLike } = useLikedPosts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const lastTap = useRef<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const images = entry.imageUris || [];

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
      if (!isLiked(entry.id)) {
        toggleLike(entry.id);

        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }
    }
    lastTap.current = now;
  };

  const handleSave = async () => {
    if (isPostSaved(entry.id)) {
      await unsavePost(entry.id);
      Alert.alert('Removed from Favorites', 'This memory has been removed from your favorites.');
    } else {
      await savePost(entry as any);
      Alert.alert('Saved to Favorites', 'This memory has been saved to your favorites.');
    }
  };

  const handleShareLocation = async () => {
    try {
      const message = `Check out this location from my travel diary: ${entry.address}\n\n${entry.description || ''}`;
      await Share.share({
        message: message,
        title: 'Travel Location',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the location');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onRemove(entry.id),
        },
      ]
    );
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  return (

    <View style={[ styles.container, theme === 'dark' ? styles.containerDark : null ]}>

      {/* Header */}

      <View style={[ styles.header, theme === 'dark' ? styles.headerDark : null ]}>

        <View style={styles.userInfo}>

          <Image 
            source={require('../assets/diary.jpg')} 
            style={styles.avatar}
          />
          <Text style={[ styles.username, theme === 'dark' ? styles.textDark : null ]}>
            Travel Diary
          </Text>

        </View>

        <TouchableOpacity 
          onPress={handleDelete}
          style={[
            styles.closeButton,
            theme === 'dark' ? styles.closeButtonDark : null
          ]}
        >

          <Ionicons 
            name="close" 
            size={18} 
            style={[
              styles.closeIcon,
              theme === 'dark' ? styles.textDark : null
            ]} 
          />

        </TouchableOpacity>

      </View>

      {/* Image Gallery */}

      <View style={styles.imageGalleryContainer}>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={handleDoubleTap}
                activeOpacity={1}
              >
                <Image 
                  source={{ uri }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <Animated.View 
                  style={[
                    styles.likeAnimation,
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: opacityAnim,
                    }
                  ]}
                >
                  <Ionicons name="heart" size={80} color="#FF4B4B" />
                </Animated.View>

              </TouchableOpacity>

            </View>

          ))}

        </ScrollView>
        
        {/* Photo Count */}

        {images.length > 1 && (
          <View style={[
            styles.photoCountContainer,
            theme === 'dark' ? styles.photoCountContainerDark : null
          ]}>
            <Text style={styles.photoCount}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>
        )}

        {/* Pagination Dots */}
        
        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            <View style={[
              styles.pagination,
              theme === 'dark' ? styles.paginationDark : null
            ]}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                    theme === 'dark' ? styles.paginationDotDark : null
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}

      <View style={[ styles.actionButtons, theme === 'dark' ? styles.actionButtonsDark : null ]}>

        <View style={styles.leftActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => toggleLike(entry.id)}
          >
            <Ionicons 
              name={isLiked(entry.id) ? "heart" : "heart-outline"} 
              size={28} 
              style={[
                isLiked(entry.id) ? styles.heartIconActive : styles.heartIcon,
                theme === 'dark' ? styles.textDark : null
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Ionicons 
              name={isPostSaved(entry.id) ? "bookmark" : "bookmark-outline"} 
              size={28} 
              style={[
                isPostSaved(entry.id) ? styles.saveIconActive : styles.saveIcon,
                theme === 'dark' ? styles.textDark : null
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShareLocation}>
            <Ionicons 
              name="share-outline" 
              size={28} 
              style={[
                styles.shareIcon,
                theme === 'dark' ? styles.textDark : null
              ]}
            />
          </TouchableOpacity>

        </View>
      </View>

      {/* Description */}

      {entry.description && (
        <View style={[ styles.descriptionContainer, theme === 'dark' ? styles.descriptionContainerDark : null ]}>

          <Text style={[
            styles.description,
            theme === 'dark' ? styles.textDark : null
          ]}>
            {entry.description}
          </Text>

        </View>
      )}

      {/* Location and Timestamp */}

      <View style={[ styles.detailsContainer, theme === 'dark' ? styles.detailsContainerDark : null ]}>

        <Text style={[ styles.address, theme === 'dark' ? styles.textDark : null ]}>

          <Ionicons 
            name="location" 
            size={16} 
            style={[
              styles.locationIcon,
              theme === 'dark' ? styles.locationIconDark : null
            ]} 
          /> {entry.address}

        </Text>

        <Text style={[ styles.timestamp, theme === 'dark' ? styles.timestampDark : null ]}>
          {entry.timestamp}
        </Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#F2E7DD',
    borderBottomColor: '#CA8E82',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#F2D6CE',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#CA8E82',
  },

  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#292421', 
    fontFamily: 'serif',
  },

  closeButton: {
    backgroundColor: '#C4B1AA',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#847769',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  closeButtonDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#F2E7DD',
  },

  closeIcon: {
    color: '#292421',
  },

  imageGalleryContainer: {
    position: 'relative',
  },

  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    padding: 5,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  photoCountContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(202, 142, 130, 0.6)',
  },

  photoCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  pagination: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(202, 142, 130, 0.6)',
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    backgroundColor: '#F2D6CE',
  },

  paginationDotActive: {
    backgroundColor: '#F2E7DD',
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F2D6CE',
  },

  leftActions: {
    flexDirection: 'row',
  },

  actionButton: {
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  heartIcon: {
    color: '#292421', 
  },

  heartIconActive: {
    color: '#CA8E82', 
  },
  
  saveIcon: {
    color: '#292421',
  },

  saveIconActive: {
    color: '#CA8E82',
  },

  shareIcon: {
    color: '#292421',
  },

  descriptionContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F2D6CE",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#292421', 
  },

  detailsContainer: {
    padding: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#F2D6CE',
  },

  address: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#292421', 
  },
  
  locationIcon: {
    color: '#CA8E82',
  },

  timestamp: {
    fontSize: 12,
    color: 'rgba(41, 36, 33, 0.6)', 
  },

  containerDark: {
    backgroundColor: '#1A1A1A',
    borderBottomColor: '#2A2A2A',
  },

  headerDark: {
    backgroundColor: '#2A2A2A',
  },

  textDark: {
    color: '#F2E7DD',
  },

  photoCountContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  paginationDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  paginationDotDark: {
    backgroundColor: '#F2E7DD',
  },

  actionButtonsDark: {
    backgroundColor: '#2A2A2A',
  },

  descriptionContainerDark: {
    backgroundColor: '#2A2A2A',
  },

  detailsContainerDark: {
    backgroundColor: '#2A2A2A',
  },

  locationIconDark: {
    color: '#CA8E82',
  },

  timestampDark: {
    color: 'rgba(242, 231, 221, 0.6)',
  },

  imageContainer: {
    position: 'relative',
  },

  likeAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
  
});