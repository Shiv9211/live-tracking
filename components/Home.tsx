import { Box, GluestackUIProvider, Button, ButtonText, Pressable, Text, Center, config } from '@gluestack-ui/themed';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView, SafeAreaView } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
// import MapViewDirections from 'react-native-maps-directions';

import SearchBar from './SearchBar';


export default function Home()  {
    const [userLocation, setUserLocation] = useState({
        latitude: 43.65107,
          longitude: -79.347015,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
    })
    const [userAddress, setUserAddress] = useState({})
    const [locationErrorMsg, setLocationErrorMsg] = useState('')
    const [isUserReached, setIsUserReached] = useState(false);
  
    const getUserLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied')
      }
      let location = await Location.getCurrentPositionAsync()
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      })
      let address = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude})
      setUserAddress(address[0])
      console.log(userLocation, address)
    }
    const arr = [
      {
        latitude: 12.890741680956252, 
        longitude: 77.59805423851701
      },
      {
        latitude: 12.89546103611594, 
        longitude: 77.59955932832474
      },
      {
        latitude: 12.902225487070558,
        longitude: 77.60091593521248
      },
      {
        latitude: 12.907555542112366,
        longitude: 77.60110377307696
      },
      {
        latitude: 12.910423959831613,
        longitude: 77.59961150548584
      },
      {
        latitude: 12.911024857744303,
        longitude: 77.6018098385173,
      }
    ]
  
    useEffect(() => {
      getUserLocation()
      let i = 0
      // let timer = setInterval(() => {
      //   console.log("User is Moving")
      //   if(i === arr.length) {
      //     console.log('User Reached destination!!')
      //     setIsUserReached(true)
      //     clearInterval(timer)
      //   }
      //     else {
      //       setUserLocation({
      //         ...userLocation,
      //         latitude: arr[i].latitude,
      //         longitude: arr[i].longitude
      //       })
      //       i++;
      //     }
      // }, 5000)
    }, [])
  
    return (
      <SafeAreaView>
      <Box>
        <SearchBar  />
  
        <MapView style={styles.map} region={userLocation}>
  
        {/* <MapViewDirections
            origin={userLocation}
            destination={{
              latitude: 12.911024857744303,
              longitude: 77.6018098385173,
            }}
            apikey="AIzaSyDS8hoaEYYrKOG1uk8Yyds88gx3RlV0c50"
            strokeWidth={4}
            strokeColor="red"
            mode={'TRANSIT'}
          /> */}
  
          <Marker coordinate={userLocation} title="You"/>
          {/* <Marker coordinate={{
            latitude: 12.911024857744303,
            longitude: 77.6018098385173,
          }} title="Office" /> */}
        </MapView>
          
          <Box bg="$white" p='$2.5' style={styles.textBox}>
          <Center> 
            {userAddress ? 
            <Center>
              <Text size='2xl' bold={true}>{userAddress?.name}, {userAddress.district}</Text>
            <Text size='2xl'>{userAddress?.postalCode}</Text>
            </Center> : <Text>Address Not Found</Text>  
          }
          </Center>
          {/* <Center>
            {isUserReached ? <Text size="2xl" bold={true} color="$green">Destination Reached 	✅</Text> : <Text size="2xl" bold={true} color="$red">Moving towards destination. →</Text>}
          </Center> */}
          <Box p="$5" style={styles.buttonsContainer}>
          {/* <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
          >
            <ButtonText>View shared</ButtonText>
          </Button> */}
          <Button
            w="$full"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
          >
            <ButtonText>Share Location</ButtonText>
          </Button>
          </Box>
  
          </Box>
      </Box>
      </SafeAreaView>
    )
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative'
    },
    map: {
      width: '100%',
      height: '80%',
    },
    textBox: {
      height: '20%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    buttonsContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    
  });