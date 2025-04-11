import React, { useState, useLayoutEffect, useEffect } from 'react';
import { 
  Button, 
  Image, 
  View, 
  Alert, 
  StyleSheet, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import uuid from 'react-native-uuid';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { saveEntries, loadEntries } from '../utils/storage';
import { getAddressFromCoords } from '../utils/geolocation';
import { BottomTabParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { TravelEntry } from '../types/entry';

type AddEntryScreenProps = BottomTabScreenProps<BottomTabParamList, 'Post'>;

const MAX_PHOTOS = 10;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function AddEntryScreen({ navigation }: AddEntryScreenProps) {
  const [images, setImages] = useState<string[]>([]);
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<{ address: string; coords: { latitude: number; longitude: number } } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigationNative = useNavigation();

  const dynamicStyles = StyleSheet.create({

    mainContainer: {
      backgroundColor: theme === 'dark' ? '#121212' : '#F5EBE1',
    },

    imageSection: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderWidth: theme === 'dark' ? 1 : 0,
      borderColor: theme === 'dark' ? '#F2E7DD' : 'transparent',
    },

    sectionTitle: {
      color: theme === 'dark' ? '#F2E7DD' : '#847769',
    },

    sectionSubtitle: {
      color: theme === 'dark' ? '#F2E7DD' : '#847769',
    },

    thumbnailImage: {
      borderColor: theme === 'dark' ? '#F2E7DD' : '#847769',
      borderWidth: 1,
    },

    removeButton: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#C4B1AA',
      borderWidth: theme === 'dark' ? 1 : 0,
      borderColor: theme === 'dark' ? '#F2E7DD' : 'transparent',
    },

    addPhotoButton: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#C4B1AA',
      borderWidth: theme === 'dark' ? 1 : 0,
      borderColor: theme === 'dark' ? '#F2E7DD' : 'transparent',
    },

    addPhotoText: {
      color: theme === 'dark' ? '#F2E7DD' : '#FFFFFF',
    },

    inputSection: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderWidth: theme === 'dark' ? 1 : 0,
      borderColor: theme === 'dark' ? '#F2E7DD' : 'transparent',
    },

    input: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F5EBE1',
      borderColor: theme === 'dark' ? '#F2E7DD' : '#847769',
      borderWidth: 1,
      color: theme === 'dark' ? '#F2E7DD' : '#292421',
    },

    locationDisplay: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F5EBE1',
      borderColor: theme === 'dark' ? '#F2E7DD' : '#847769',
      borderWidth: 1,
    },

    locationText: {
      color: theme === 'dark' ? '#F2E7DD' : '#292421',
    },

    saveButtonContainer: {
      backgroundColor: theme === 'dark' ? '#121212' : '#F5EBE1',
      borderTopWidth: 1,
      borderTopColor: theme === 'dark' ? 'rgba(242, 231, 221, 0.2)' : 'rgba(132, 119, 105, 0.2)',
    },

    saveButton: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#C4B1AA',
      borderWidth: theme === 'dark' ? 1 : 1,
      borderColor: theme === 'dark' ? '#F2E7DD' : '#FFF',
    },

    saveButtonText: {
      color: theme === 'dark' ? '#F2E7DD' : '#FFFFFF',
    },

    removeButtonIcon: {
      color: '#FFFFFF',
    },

    cameraIcon: {
      color: '#FFFFFF',
    },

    locationIcon: {
      color: '#CA8E82',
    },

    themeToggle: {
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#C4B1AA',
      borderColor: theme === 'dark' ? '#F2E7DD' : '#847769',
      borderWidth: 1,
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    photoCount: {
      fontSize: 14,
      fontWeight: '500',
      opacity: 0.8,
      color: theme === 'dark' ? '#F2E7DD' : '#847769',
    },

    imageGallery: {
      flexDirection: 'row',
      paddingVertical: 8,
    },

    imageContainer: {
      marginRight: 12,
    },

  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={toggleTheme}
          style={[
            styles.themeToggle,
            dynamicStyles.themeToggle
          ]}
        >
          <Ionicons 
            name={theme === 'dark' ? 'sunny' : 'moon'} 
            size={20} 
            color={theme === 'dark' ? '#F2E7DD' : '#292421'} 
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, dynamicStyles.themeToggle]);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications to receive updates about your posts.');
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= MAX_PHOTOS) {
      Alert.alert('Limit Reached', `You can only add up to ${MAX_PHOTOS} photos per entry.`);
      return;
    }
  
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return;
      }
  
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to save your travel location.');
        return;
      }
  
      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
      });
  
      const addr = await getAddressFromCoords(coords.coords.latitude, coords.coords.longitude);
  
      const result = await ImagePicker.launchCameraAsync({ quality: 1 });
      if (!result.canceled) {
        setImages(prev => [...prev, result.assets[0].uri]);
        setAddress(addr);
        setLocation({ address: addr, coords: coords.coords });
      }
  
    } catch (error) {
      console.error('Error getting location or camera:', error);
      Alert.alert('Error', 'Could not complete the process. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length === 0) {
        setAddress('');
        setLocation(null);
      }
      return newImages;
    });
  };

  const handleSave = async () => {
    if (!images.length) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    setIsLoading(true);
    try {
      const newEntry: TravelEntry = {
        id: Date.now().toString(),
        imageUris: images,
        description,
        address: location?.address || '',
        timestamp: new Date().toLocaleString(),
        location: location?.coords || null,
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Travel Entry Added! ✈️",
          body: "Your travel memory has been saved successfully.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, 
      });
      await saveEntries([newEntry, ...(await loadEntries())]);
      setImages([]);
      setDescription('');
      setLocation(null);      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <View style={[styles.mainContainer, dynamicStyles.mainContainer]}>

      <View style={[styles.headerContainer, { borderBottomColor: theme === 'dark' ? 'rgba(242, 231, 221, 0.2)' : 'rgba(132, 119, 105, 0.2)' }]}>
        <Ionicons 
          name="add-circle" 
          size={24} 
          color={theme === 'dark' ? '#F2E7DD' : '#847769'} 
          style={styles.headerIcon}
        />
        <Text style={[styles.headerText, { color: theme === 'dark' ? '#F2E7DD' : '#847769' }]}>
          My Entry
        </Text>
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>

          {/* Image Section */}

          <View style={[styles.imageSection, dynamicStyles.imageSection]}>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                Photos
              </Text>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                {images.length} / {MAX_PHOTOS}
              </Text>
            </View>

            <Text style={[styles.sectionSubtitle, dynamicStyles.sectionSubtitle]}>
              Add photos to capture your memories
            </Text>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image 
                    source={{ uri }} 
                    style={[
                      styles.thumbnailImage,
                      dynamicStyles.thumbnailImage
                    ]} 
                  />
                  <TouchableOpacity 
                    style={[
                      styles.removeButton,
                      dynamicStyles.removeButton
                    ]}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={16} style={dynamicStyles.removeButtonIcon} />
                  </TouchableOpacity>
                </View>
              ))}

              {images.length < MAX_PHOTOS && (
                <TouchableOpacity 
                  style={[
                    styles.addPhotoButton,
                    dynamicStyles.addPhotoButton
                  ]}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={24} style={dynamicStyles.cameraIcon} />
                  <Text style={[styles.addPhotoText, dynamicStyles.addPhotoText]}>
                    Add Photo
                  </Text>
                </TouchableOpacity>
              )}

            </ScrollView>

          </View>

          {/* Description Section */}

          <View style={[styles.inputSection, dynamicStyles.inputSection]}>

            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Description
            </Text>

            <Text style={[styles.sectionSubtitle, dynamicStyles.sectionSubtitle]}>
              Share your thoughts and memories
            </Text>

            <TextInput
              style={[
                styles.input,
                dynamicStyles.input
              ]}
              placeholder="Write your entry here..."
              placeholderTextColor={theme === 'dark' ? '#F2E7DD' : '#847769'}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

          </View>

          {/* Location Section */}

          <View style={[styles.inputSection, dynamicStyles.inputSection]}>

            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Location
            </Text>

            <Text style={[styles.sectionSubtitle, dynamicStyles.sectionSubtitle]}>
              Where did you take these photos?
            </Text>

            <View style={[
              styles.locationDisplay,
              dynamicStyles.locationDisplay
            ]}>

              <Ionicons name="location" size={20} style={dynamicStyles.locationIcon} />
              <Text style={[styles.locationText, dynamicStyles.locationText]}>
                {location ? location.address : 'Location will be added with photos'}
              </Text>
            </View>

          </View>

        </View>

      </ScrollView>

      <View style={[styles.saveButtonContainer, dynamicStyles.saveButtonContainer]}>

        <TouchableOpacity
          style={[
            styles.saveButton,
            dynamicStyles.saveButton,
            isLoading && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={isLoading}
        >

          <Text style={[styles.saveButtonText, dynamicStyles.saveButtonText]}>
            {isLoading ? 'Saving...' : 'Save Entry'}
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  
  mainContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },

  form: {
    gap: 16,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },

  headerIcon: {
    marginRight: 8,
  },

  headerText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'serif',
  },

  imageSection: {
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'serif',
  },

  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
    fontFamily: 'serif',
    opacity: 0.8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  photoCount: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },

  imageGallery: {
    flexDirection: 'row',
    paddingVertical: 8,
  },

  imageContainer: {
    marginRight: 12,
  },

  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
  },

  removeButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 12,
  },

  addPhotoText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  inputSection: {
    borderRadius: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },

  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    minHeight: 48,
    borderWidth: 1,
  },

  locationText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },

  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  saveButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  saveButtonDisabled: {
    opacity: 0.5,
  },

  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'serif',
    letterSpacing: 1,
  },

  removeButtonIcon: {
    color: '#FFFFFF',
  },

  cameraIcon: {
    color: '#FFFFFF',
  },

  locationIcon: {
    color: '#CA8E82',
  },

  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 15,
  },

  themeToggleDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#F2E7DD',
  },
  
});