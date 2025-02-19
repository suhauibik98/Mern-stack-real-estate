import { io } from "socket.io-client";

const socket = io("http://10.10.30.30:5001"); // Replace with your backend server URL
export default socket;