import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket, setToken } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
      console.log(token); 
    }
    dispatch(connectSocket());
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
