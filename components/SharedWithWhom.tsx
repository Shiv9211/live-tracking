import { Box, VStack, Button, ButtonText, Text, Center } from '@gluestack-ui/themed';

import { ScrollView, SafeAreaView ,StyleSheet} from 'react-native';
import { useContext, useEffect } from 'react';
import UserContext from '../utils/UserContext';
import { getAllSharedLoctionByUser, stopLocationSharing } from '../services/addNewUser'


export default function SharedWithWhom() {

    const { user, allSharedLocations, setAllSharedLocations } = useContext(UserContext)

    const apiCall = async () => {
        const sharedLocations = await getAllSharedLoctionByUser(user.idToken)
        setAllSharedLocations(sharedLocations)
    }

    const handleStopSharing = async (email: string) => {
        const res = await stopLocationSharing(user.idToken, email)
        if(res.status === 'success') {
            const userList = allSharedLocations.filter((item: any) => item?.destUser !== email)
            console.log(userList, allSharedLocations) 
            setAllSharedLocations(userList)
        }
    }

    useEffect(() => {
        console.log("Form Shared component useEffect")
        apiCall()
    }, [])

    return (
        <SafeAreaView>
             <Box w="$full" h="$full" bg="$blueGray50" style={styles.main}>
                <Text color="$info700" size='2xl' bold={true} underline={true} m="$4">All Locations Shared By You</Text>
                <VStack space="md" w="$full" h="$full" alignItems={'center'}  reversed={false}>
                    {
                        allSharedLocations?.length > 0 && allSharedLocations.map((item: any) => {
                            return <Box w="$4/5" h="$32" borderWidth={2} bg="$white" p="$3" rounded='$lg' key={item.id}>
                            <Text size="md" color="$trueGray900">User Email: {item.destUser}</Text>
                            <Text size="sm" color="$trueGray500">Started at: {item.startedAt}</Text>
                            <Button
                                mt="$2"
                                w="$full"
                                variant="solid"
                                action="primary"
                                isDisabled={false}
                                isFocusVisible={false}
                                onPress={() => handleStopSharing(item.destUser)}
                            >
                                <ButtonText>Stop Sharing</ButtonText>
                            </Button>
                        </Box>
                        })
                    }
                    
                </VStack>
            </Box>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    loginContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
})