import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}`); // Replace with your backend server URL
export default socket;