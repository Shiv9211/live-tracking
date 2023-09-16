import SockJs from 'sockjs-client'
import { over } from "stompjs";



function makeSocketConnection(userEmail) {
    let socketData
    const socket = new SockJs("http://13.232.18.102:8080/v1")
    const stompClient = over(socket)
    stompClient.connect({}, onConnected, onError);
    function onConnected() {
        console.log("Connected to WebSocket")
        stompClient.subscribe(
            `/socket/${userEmail}`,
            onMessageReceived
        )
    }
    function onError(error) {
        console.log("Error while connecting to WebSocket: ", error)
    }
    function onMessageReceived (message) {
        console.log("Received message: ", message.body)
        socketData = {
            lat: JSON.parse(message.body).latitude,
            lng: JSON.parse(message.body).logitude,
            userName: JSON.parse(message.body).username
        }
    }
    console.log(socketData, "From Socket File")
    return socketData
}

export { makeSocketConnection }