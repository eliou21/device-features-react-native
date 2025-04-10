import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelEntry } from '../types/entry';

interface LikedPostsContextType {
  likedPosts: string[];
  toggleLike: (postId: string) => void;
  isLiked: (postId: string) => boolean;
}

const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

export const LikedPostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  useEffect(() => {
    loadLikedPosts();
  }, []);

  const loadLikedPosts = async () => {
    try {
      const storedLikes = await AsyncStorage.getItem('likedPosts');
      if (storedLikes) {
        setLikedPosts(JSON.parse(storedLikes));
      }
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  };

  const saveLikedPosts = async (posts: string[]) => {
    try {
      await AsyncStorage.setItem('likedPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving liked posts:', error);
    }
  };

  const toggleLike = async (postId: string) => {
    setLikedPosts(prev => {
      const newLikes = prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId];
      saveLikedPosts(newLikes);
      return newLikes;
    });
  };

  const isLiked = (postId: string) => likedPosts.includes(postId);

  return (
    <LikedPostsContext.Provider value={{ likedPosts, toggleLike, isLiked }}>
      {children}
    </LikedPostsContext.Provider>
  );
};

export const useLikedPosts = () => {
  const context = useContext(LikedPostsContext);
  if (context === undefined) {
    throw new Error('useLikedPosts must be used within a LikedPostsProvider');
  }
  return context;
}; 