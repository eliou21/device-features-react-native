import React, { useEffect } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import BottomTabs from './navigation/BottomTabs';
import { ThemeProvider } from './theme/ThemeContext';
import { SavedPostsProvider } from './context/SavedPostsContext';
import { LikedPostsProvider } from './context/LikedPostsContext';
import { RootStackParamList } from './types/navigation';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <ThemeProvider>
      <SavedPostsProvider>
        <LikedPostsProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Main" component={BottomTabs} />
            </Stack.Navigator>
          </NavigationContainer>
        </LikedPostsProvider>
      </SavedPostsProvider>
    </ThemeProvider>
  );
}