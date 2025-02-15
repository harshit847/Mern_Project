import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

// Define WebSocket URL (Replace with actual backend URL)
const SOCKET_URL = "wss://chat-app-watw.onrender.com"; 

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profile_pic = "";
      state.token = "";
      
      // ✅ Disconnect WebSocket on logout
      if (state.socketConnection) {
        state.socketConnection.disconnect();
      }
      
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

// ✅ Function to Initialize WebSocket Connection
export const connectSocket = () => (dispatch, getState) => {
  const { socketConnection } = getState().user;

  // Prevent multiple WebSocket connections
  if (!socketConnection) {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"], // Use direct WebSocket connection
    });

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected!");
      dispatch(setSocketConnection(socket));
    });

    socket.on("disconnect", () => {
      console.warn("❌ WebSocket Disconnected!");
      dispatch(setSocketConnection(null));
    });
  }
};

export default userSlice.reducer;
