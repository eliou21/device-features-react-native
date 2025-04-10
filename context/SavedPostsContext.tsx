import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedEntry } from '../types/entry';

interface SavedPostsContextType {
  savedPosts: SavedEntry[];
  savePost: (post: SavedEntry) => Promise<void>;
  unsavePost: (postId: string) => Promise<void>;
  isPostSaved: (postId: string) => boolean;
}

const SavedPostsContext = createContext<SavedPostsContextType | undefined>(undefined);

export function SavedPostsProvider({ children }: { children: React.ReactNode }) {
  const [savedPosts, setSavedPosts] = useState<SavedEntry[]>([]);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedPosts');
      if (saved) {
        setSavedPosts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved posts:', error);
    }
  };

  const savePost = async (post: SavedEntry) => {
    try {
      const newSavedPost = {
        ...post,
        savedAt: new Date().toISOString(),
      };
      const updatedSavedPosts = [newSavedPost, ...savedPosts];
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
      setSavedPosts(updatedSavedPosts);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const unsavePost = async (postId: string) => {
    try {
      const updatedSavedPosts = savedPosts.filter(post => post.id !== postId);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
      setSavedPosts(updatedSavedPosts);
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const isPostSaved = (postId: string) => {
    return savedPosts.some(post => post.id === postId);
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, savePost, unsavePost, isPostSaved }}>
      {children}
    </SavedPostsContext.Provider>
  );
}

export function useSavedPosts() {
  const context = useContext(SavedPostsContext);
  if (context === undefined) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
} 