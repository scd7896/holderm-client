import { io } from "socket.io-client";

const socket = io("http://localhost:10001");

export default socket;
