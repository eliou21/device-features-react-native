import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../types/navigation';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import SavedPostsScreen from '../screens/SavedPostsScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleExit = () => {
    navigation.replace('Welcome');
  };

  return (

    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#292421' : '#rgb(178, 193, 174)',
        },
        headerTintColor: theme === 'dark' ? '#F2E7DD' : '#292421',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#292421' : '#rgb(178, 193, 174)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 52,
        },
        tabBarActiveTintColor: '#A66C60',
        tabBarInactiveTintColor: theme === 'dark' ? '#F2D6CE' : '#373936',
        tabBarLabelStyle: {
          fontSize: 10,
        },

        tabBarButton: (props) => {
          const { onPress, style, children } = props;
          return (
            <TouchableOpacity
              onPress={onPress}
              activeOpacity={1}
              style={[
                style,
                {
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                },
              ]}
            >
              {children}
            </TouchableOpacity>
          );
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleTheme}
              style={[
                styles.themeToggle,
                theme === 'dark' ? styles.themeToggleDark : null
              ]}
            >
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={20}
                color={theme === 'dark' ? '#F2E7DD' : '#292421'}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen 
        name="Post" 
        component={AddEntryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-box" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen 
        name="Saved" 
        component={SavedPostsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={toggleTheme}
              style={[
                styles.themeToggle,
                theme === 'dark' ? styles.themeToggleDark : null
              ]}
            >
              <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={20}
                color={theme === 'dark' ? '#F2E7DD' : '#292421'}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen 
        name="Exit" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="exit" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleExit();
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  themeToggle: {
    backgroundColor: '#C4B1AA',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#847769',
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  themeToggleDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#F2E7DD',
  },
  
});
