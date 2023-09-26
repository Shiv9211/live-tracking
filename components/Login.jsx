import { 
    Box,
    Text, 
    Button,
    ButtonText,
} from '@gluestack-ui/themed';
import Home from './Home'

import { ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native';
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState, useContext } from 'react';
import { addUser } from '../services/addNewUser'
import UserContext from '../utils/UserContext';

export default function Login() {
  const [accessToken, setAccessToken] = useState(null)
  const [idToken, setIdToken] = useState(null)

  const {user, setUser} = useContext(UserContext)

  WebBrowser.maybeCompleteAuthSession();
  const [request, response, googleAuthAsync] = Google.useAuthRequest({
    expoClientId:
      "CLIENT_ID_FOR_WEB",
      iosClientId: 'CLIENT_ID_FOR_iOS',
      androidClientId: 'CLIENT_ID_FOR_ANDROID',
      scopes: ['email', 'profile']
  });
  useEffect(() => {
    if(response?.type === 'success') {
      setUser({ ...user,
        idToken: response.params.id_token,
        accessToken: response.authentication.accessToken
      })
      setIdToken(response.params.id_token)
      setAccessToken(response.authentication.accessToken)
      accessToken && fetchUserInfo();
      idToken && addUser(idToken)
    }
  }, [response, accessToken])

  async function fetchUserInfo() {
    console.log(idToken)
    let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    const data = await response.json();
    data && setUser(user => ({ ...user, userData: data }))
  } 

    return (
       user.idToken !== "" ? <Home /> : <SafeAreaView>
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
                googleAuthAsync();
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