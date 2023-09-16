import { Box, InputField, Button, ButtonText, Input, Text, Center, Icon } from '@gluestack-ui/themed';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ScrollView, SafeAreaView ,StyleSheet, View ,TextInput} from 'react-native';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../utils/UserContext';
import * as Location from 'expo-location';

import { shareLocation, getAllSharedLoctionToUser, getAllSharedLoctionByUser, pushLocation } from '../services/addNewUser'
import SockJs from 'sockjs-client'
import { over } from "stompjs";

interface ISharedLoctionToUser {
  id: number,
  sourceUser: string,
  destUser: string,
  startedAt: string
}

let foregroundSubscription: { remove: () => void; } | null = null

export default function Home()  {
    const [userLocation, setUserLocation] = useState<any>()
    const [userAddress, setUserAddress] = useState<any>()
    const [locationErrorMsg, setLocationErrorMsg] = useState('')
    const [isReadyToShare, setIsReadyToShare] = useState<boolean>(false)
    const [targetedEmail, setTargetedEmail] = useState<string>("")
    let timer = null
    const { user, setUser, setAllRecievedLocations, allRecievedLocations, setAllSharedLocations } = useContext(UserContext)

    const getUserLocation = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync()
          if(!foreground.granted) {
            setLocationErrorMsg('Permission to access location was denied')
            console.log("Permissons granted")
          }
      const { granted } = await Location.getForegroundPermissionsAsync()
      if(!granted) {
        setLocationErrorMsg('Location tracking denied!')
        return
      }
      foregroundSubscription?.remove()

      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
        },
        async (location) => {
          console.log(location.coords)
          setUser({
            ...user, locationCoords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }
          })
          let address = await Location.reverseGeocodeAsync({ 
            latitude: location.coords.latitude, longitude: location.coords.longitude
          })
          setUserAddress(address[0])
        }
      )
    }

    const handleSubmit = async () => {
      const res = await shareLocation(user.idToken, targetedEmail)
      if(res.status === 'success') {
        const sharedList = await getAllSharedLoctionByUser(user.idToken)
        setAllSharedLocations(sharedList)
      alert(`Your live location is shared with ${targetedEmail}.`)
      setTargetedEmail('')
      setIsReadyToShare(false)
      }
      
    }

    const allApiCall = async () => {
      
      const allRecievedLocation = await getAllSharedLoctionToUser(user.idToken)
      const socket = new SockJs("http://13.232.18.102:8080/v1")
      const stompClient = over(socket)
      stompClient.connect({}, onConnected, onError);
      function onConnected() {
        console.log("Connected to WebSocket")
        allRecievedLocation.forEach((element: any) => {
          console.log(element.sourceUser)
          let data = stompClient.subscribe(
            `/socket/${element.sourceUser}`,
            onMessageReceived
            )
            
        });
      }
      function onError(error:any) {
        console.log("Error while connecting to WebSocket: ", error)
      }
      function onMessageReceived (message: any) {
        console.log("Received message: ", JSON.parse(message.body))
        const obj = JSON.parse(message.body)
        setAllRecievedLocations((prev : Object) => ({
          ...prev,
          [obj.email]: {
            latitude: obj.latitude,
            longitude: obj.longitude
          }
        }))
        console.log(allRecievedLocations, "Line 95")
        }

      }

      useEffect(() => {
        getUserLocation()
        allApiCall()
        timer = setInterval(() => {
          pushLocation(user.idToken, user?.locationCoords?.latitude, user?.locationCoords?.longitude)
        }, 10000)


        return () => {
          clearInterval(timer)
        }
      }, [])
  
    return (
      <SafeAreaView>
      <Box>
        <MapView style={styles.map} region={{...user.locationCoords, latitudeDelta: 0.05,
          longitudeDelta: 0.05,}} provider={PROVIDER_GOOGLE}>
  
          <Marker coordinate={user.locationCoords} title="You"/>
          {
            allRecievedLocations && Object.keys(allRecievedLocations)?.length > 0 &&  Object.keys(allRecievedLocations)?.map((item: any) => {
              return <Marker coordinate={allRecievedLocations[item]} key={item} title={item}/>
            })
          }
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
          <Box p="$5" style={styles.buttonsContainer}>

              { isReadyToShare ?  <Box style={styles.inputWrapper}><TextInput
              style={styles.textInput}
                placeholder="enter your message here"
                value={targetedEmail}
                onChangeText={(text) => setTargetedEmail(text)}
                onSubmitEditing={handleSubmit}
            >
            </TextInput>
              <Text color="$black" size='lg' bold={true} m="$2"
              onPress={() => {
                setIsReadyToShare(false)
                setTargetedEmail('')
              }}>
                x</Text></Box>
              : <Button
                w="$full"
                variant="solid"
                action="primary"
                isDisabled={false}
                isFocusVisible={false}
                onPress={() => {
                  setIsReadyToShare(true)
                }}
              >
                <ButtonText>Share Location</ButtonText>
              </Button> }
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
    textInput:{
      borderWidth:1,
      borderColor:"black",
      width:"100%",
      padding:16,
      borderRadius:4,
      flex: 1,
    },
    inputWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    inputStyle: {
      
    }
    
  });