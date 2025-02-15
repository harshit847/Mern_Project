import { Outlet } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "./redux/userSlice"; // Import WebSocket function

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(connectSocket());  // ✅ Connect WebSocket on app load
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
