import { io } from "socket.io-client";

const user = JSON.parse(localStorage.getItem("user"));

export const socket = io("http://localhost:5000", {
  auth: {
    userId: user?._id,
  },
  transports: ["websocket"], // 🔥 IMPORTANT
  withCredentials: true
});
