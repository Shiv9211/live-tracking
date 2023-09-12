import { 
    Box, 
    Input,
    InputField,
    Text
} from '@gluestack-ui/themed';

import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';

import Hamburgur from '../assets/assets/Icons/Hamburgur.tsx'


export default function SearchBar() {
    return (
      <Box  w="$full" p="$4" style={searchBarStyles.searchBar}> 
       {/* <Hamburgur />
        */}
        <Text>Icon</Text>
      </Box>
    );
  }

const searchBarStyles = StyleSheet.create({
    searchBar: {
        position: 'absolute',
        top: 60,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
})