import {GluestackUIProvider } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Home from './components/HomePage'
import Login from './components/Login'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('googleAccessToken');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to check authentication:", error);
    }
  };


  return (
    <GluestackUIProvider>
       {isAuthenticated ? <Home /> : <Login />}
      {/* <Login /> */}
    </GluestackUIProvider>
  );
}