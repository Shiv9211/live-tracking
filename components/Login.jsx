import { 
    Box,
    Text, 
    Button,
    Icon, 
    ButtonText,
} from '@gluestack-ui/themed';
// import Home from './Home'

import { ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google'
import { useEffect, useState } from 'react';

// Initialize Google Sign-In
// GoogleSignin.configure({
//   scopes: ['email', 'profile', 'openid'],
//   webClientId: '165612333768-27g9eem8qtbs7bguppidd48o7fjc1hbv.apps.googleusercontent.com', // Your OAuth client ID
// });

export default function Login() {
  const [accessToken, setAccessToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [request, response, promtAsync] = Google.useIdTokenAuthRequest({
    clientId: '384537390241-fu4vt9bptbc0e2nmf2o79p4f2au4u0l4.apps.googleusercontent.com',
  },{
    native: "com.gluestack.liveTracking://"
  })

  useEffect(() => {
    if(response?.type === 'success') {
      setAccessToken(response.authentication.accessToken)
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
    let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const user = await response.json();
    console.log(user)
    setUserInfo(user)
  }
    // const signInWithGoogle = async () => {
    //     try {
    //         await GoogleSignin.hasPlayServices();
    //         const userInfo = await GoogleSignin.signIn();
    //         // setState({ userInfo });
    //         console.log(userInfo)
    //       } catch (error) {
    //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //           // user cancelled the login flow
    //           console.log("User cancelled the login flow")
    //         } 
    //         if (error.code === statusCodes.IN_PROGRESS) {
    //           // operation (e.g. sign in) is in progress already
    //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //           // play services not available or outdated
    //           console.log("Play service is not available")
    //         } else {
    //           // some other error happened
    //           console.log("Some Other Error")
    //         }
    //       }
    // }


    return (
       userInfo ? <Text>Home</Text> : <SafeAreaView>
      <Box bg="$white" style={styles.mainContainer}>
          <Box bg="white" h="$4/5" w="$full" style={styles.loginContainer}>
           <Image source={require('../assets/login-logo.png')} style={{
              height: "10%",
              width: '80%',
              objectFit: 'cover',
              marginBottom: 50,
           }} />
           <Image source={require('../assets/Sign_up.png')} style={{
              height: "30%",
              width: '80%',
              objectFit: 'contain',
              marginBottom: 50
           }} />
           <Text color='$black' size='2xl' bold={true} style={{
              marginBottom: 50
           }}>Login to Your Account</Text>
          
          <Button
              w="$4/5"
              variant="outline"
              action="secondary"
              isDisabled={!request}
              isFocusVisible={false}
              onPress={() => {
                promtAsync();
              }}
              >
              <Image source={require('../assets/googleIcon.png')} style={{
                  height: 25,
                  width: 25,
                  objectFit: 'contain',
                  marginRight: 10
               }}
               />
              <ButtonText color="$black" bold={true}>Continue with Google</ButtonText>
          </Button>
          </Box>
      </Box>
      </SafeAreaView>
        
      
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
})