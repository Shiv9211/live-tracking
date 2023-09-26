import axios from 'axios'

const baseUrl = 'http://103.252.242.68:3535'

const addUser = (token) => {
    axios({
        method: 'post',
        url: `${baseUrl}/auth/addNewUser`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => {
        console.log(res.data, "from API call")
    })
}

const shareLocation = async (token, email) => {
    const targetEmail = JSON.stringify({ targetUserEmail: email });
    const { data } = await axios.post(`${baseUrl}/live/shareLocation`,
            targetEmail,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
        }
    })
    return data
}

const pushLocation = (token, lat, lan) => {
    const coord = JSON.stringify({
        latitude: lat,
        longitude: lan
    })
    axios.post(`${baseUrl}/live/updateLocation`, coord, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
    }}).then((res) => {
        console.log(res.data, "Location Pushed")
    }).catch((err) => {
        console.log(err)
    })
}



const getAllSharedLoctionToUser = async(token) => {
    let {data} = await axios.get(`${baseUrl}/live/getLocationsSharedToUser`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data
}

const getAllSharedLoctionByUser = async(token) => {
    let {data} = await axios.get(`${baseUrl}/live/getLocationsSharedByUser`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data
}

const stopLocationSharing = async (token, targetedEmail) => {
    const targetEmail = JSON.stringify({ targetUserEmail: targetedEmail });
    const { data } = await axios.post(`${baseUrl}/live/stopSharingLocation`,
            targetEmail,
            {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
        }
    })
    return data
}

export { addUser, shareLocation, pushLocation, getAllSharedLoctionToUser, getAllSharedLoctionByUser, stopLocationSharing }