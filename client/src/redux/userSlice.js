import { createSlice } from '@reduxjs/toolkit';
import io from "socket.io-client";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  token: "",
  onlineUser: [],
  socketConnection: null
};

export const userSlice = createSlice({
  name: 'user',
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
      state.onlineUser = [];
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
    }
  },
});

export const connectSocket = () => (dispatch, getState) => {
  const { user } = getState();
  if (!user.token || user.socketConnection) return;

  const socket = io(process.env.REACT_APP_BACKEND_URL, {
    query: { token: user.token }, // Use Redux token instead of localStorage
    transports: ["websocket", "polling"],
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
    dispatch(setSocketConnection(socket)); // Dispatch only after successful connection
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("⚠ WebSocket Connection Error:", err);
  });

  return socket;
};

// Action creators
export const { setUser, setToken, logout, setOnlineUser, setSocketConnection } = userSlice.actions;

export default userSlice.reducer;
