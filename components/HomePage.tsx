import { Box, GluestackUIProvider, Alert, Button, ButtonText, Pressable, Text, Center, config } from '@gluestack-ui/themed';
import MapView, { Marker } from 'react-native-maps';
import { ScrollView, SafeAreaView } from 'react-native';
import { Animated, StyleSheet, View } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
// import MapViewDirections from 'react-native-maps-directions';

import SearchBar from './SearchBar';


export default function Home() {
    const animatedPosition = useRef(new Animated.ValueXY()).current;
    const [userLocation, setUserLocation] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const locationWatcher = useRef(null); // Reference for the location watcher
    const [userAddress, setUserAddress] = useState({})
    useEffect(() => {
        checkLocationPermission();
        return () => {
            if (locationWatcher.current) {
                locationWatcher.current.remove(); // Stop the location watcher when the component is unmounted
            }
        };

    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            simulateUserMovement();
        }, 600);  // Update location every minute

        // Clear the interval after 10 minutes
        setTimeout(() => {
            clearInterval(interval);
        }, 10000);

        return () => clearInterval(interval);  // Clear the interval when the component is unmounted
    }, []);

    const simulateUserMovement = () => {
        const randomLatitudeChange = (Math.random() - 0.5) * 0.01;  // Random value between -0.005 and 0.005
        const randomLongitudeChange = (Math.random() - 0.5) * 0.01;  // Random value between -0.005 and 0.005

        setUserLocation(prevLocation => ({
            ...prevLocation,
            latitude: prevLocation.latitude + randomLatitudeChange,
            longitude: prevLocation.longitude + randomLongitudeChange,
        }));

        Animated.timing(animatedPosition, {
            toValue: { x: randomLatitudeChange, y: randomLongitudeChange },
            duration: 500, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };


    const checkLocationPermission = async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            requestLocationPermission();
        } else {
            fetchUserLocation();
        }
    }
    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need location permissions to make this work!');
            return;
        }
    }

    const fetchUserLocation = async () => {
        try {
            locationWatcher.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000, // Get updates every 1 seconds
                    distanceInterval: 10, // Or every 10 meters
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
                    setUserLocation((prev) => ({
                        ...prev,
                        latitude,
                        longitude,
                    }));
                    setUserAddress(latitude, longitude);
                }
            );


            let location = await Location.getCurrentPositionAsync({});
            let address = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
            setUserAddress(address[0])
            // setUserLocation({
            //     ...userLocation,
            //     latitude: location.coords.latitude,
            //     longitude: location.coords.longitude,
            // });
        } catch (error) {
            console.error("Error fetching user location:", error);
        }
    }


    return (
        <SafeAreaView>
            <Box>
                <SearchBar />

                {userLocation.latitude && userLocation.longitude && (
                    <MapView style={styles.map} region={userLocation}>
                        <Marker.Animated coordinate={userLocation} title="You" />
                    </MapView>
                )}

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