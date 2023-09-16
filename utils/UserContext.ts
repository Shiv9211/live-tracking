import React, { createContext } from "react";


interface IUserContext {
    user: {
        accessToken: string,
        idToken: string,
        userData: any,
        locationCoords: {
            latitude: string,
            longitude: string
        }
    },
    setUser: any,
    allRecievedLocations: Object,
    setAllRecievedLocations: any,
    allSharedLocations: any,
    setAllSharedLocations: any
    
}

const UserContext = createContext<IUserContext | any>({
    user: {
        accessToken: '',
        idToken: '',
        userData: {},
        locationCoords: {
            latitude: '',
            longitude: ''
        },
    },
    setUser: () => {},
    allRecievedLocations: {},
    setAllRecievedLocations: () => {},
    allSharedLocations: [],
    setAllSharedLocations: () => {}
    
})

export default UserContext;