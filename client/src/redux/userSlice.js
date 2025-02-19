import { createSlice } from '@reduxjs/toolkit'
import io from "socket.io-client";

const initialState = {
  _id : "",
  name : "",
  email : "",
  profile_pic : "",
  token : "",
  onlineUser : [],
  socketConnection : null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser : (state,action)=>{
        state._id = action.payload._id
        state.name = action.payload.name 
        state.email = action.payload.email 
        state.profile_pic = action.payload.profile_pic 
    },
    setToken : (state,action)=>{
        state.token = action.payload
    },
    logout : (state,action)=>{
        state._id = ""
        state.name = ""
        state.email = ""
        state.profile_pic = ""
        state.token = ""
        state.socketConnection = null
    },
    setOnlineUser : (state,action)=>{
      state.onlineUser = action.payload
    },
    setSocketConnection : (state,action)=>{
      state.socketConnection = action.payload
    }
  },
})

export const connectSocket = () => (dispatch, getState) => {
  const { token } = getState().user; // Get token from Redux state
  if (!token) return;

  const socket = io(process.env.REACT_APP_BACKEND_URL, {  // Change to your backend URL
      query: { token: localStorage.getItem("token") },
      transports: ["websocket", "polling"],
      withCredentials: true
  });

  dispatch(setSocketConnection(socket));

  socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    if (socket.user && socket.user._id) {
      onlineUser.delete(socket.user._id.toString());
  }
      console.log("Socket disconnected");
  });
  socket.on("connect_error", (err) => {
    console.error("⚠ WebSocket Connection Error:", err);
});
};

// Action creators are generated for each case reducer function
export const { setUser, setToken ,logout, setOnlineUser,setSocketConnection } = userSlice.actions



export default userSlice.reducer