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

  const socket = io("http://localhost:8080", {  // Change to your backend URL
      query: { token },
  });

  dispatch(setSocketConnection(socket));

  socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
      console.log("Socket disconnected");
  });
};

// Action creators are generated for each case reducer function
export const { setUser, setToken ,logout, setOnlineUser,setSocketConnection } = userSlice.actions



export default userSlice.reducer