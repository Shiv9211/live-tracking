import {GluestackUIProvider } from '@gluestack-ui/themed';
import { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import Home from './components/Home'
import Login from './components/Login'
import SharedWithWhom from './components/SharedWithWhom';
import UserContext from './utils/UserContext';

const Drawer = createDrawerNavigator();

export default function App() {

  const [user, setUser] = useState({
    accessToken: '',
    idToken: '',
    userData: {}
  });
  const [allRecievedLocations, setAllRecievedLocations] = useState()
  const [allSharedLocations, setAllSharedLocations] = useState()

  return (
    <GluestackUIProvider>
      <UserContext.Provider value={{
        user: user,
        setUser: setUser,
        allRecievedLocations: allRecievedLocations,
        setAllRecievedLocations: setAllRecievedLocations,
        allSharedLocations: allSharedLocations,
        setAllSharedLocations: setAllSharedLocations
      }}>
      
      {
        user.idToken ? <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Home} />
          <Drawer.Screen name="Shared" component={SharedWithWhom} />
        </Drawer.Navigator>
      </NavigationContainer> : <Login />
      }
      </UserContext.Provider>
    </GluestackUIProvider>
  );
}