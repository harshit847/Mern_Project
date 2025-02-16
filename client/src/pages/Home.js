import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Redux User State:', user);

  const fetchUserDetails = async () => {
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
        const token = localStorage.getItem("token");

        console.log("🛠 Fetching user details with token:", token);  // 👈 Yeh check karo

        const response = await axios.get(URL, {
            withCredentials: true,
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        });

        console.log("✅ API Response:", response.data);
        dispatch(setUser(response.data));

    } catch (error) {
        console.error("❌ Fetch error:", error.response?.data || error.message);
    }
};


  useEffect(() => {
    fetchUserDetails();
  }, []);

  /*** WebSocket Connection ***/
  useEffect(() => {
    const token = localStorage.getItem("token");

    const socketConnection = io(process.env.REACT_APP_WS_URL, {
      auth: {
        token: token, // Ensure token is passed properly
      },
      transports: ["websocket", "polling"],
    });

    socketConnection.on("connect", () => {
      console.log("✅ WebSocket Connected:", socketConnection.id);
    });

    socketConnection.on("connect_error", (err) => {
      console.error("🔴 WebSocket Connection Error:", err.message);
    });

    socketConnection.on("onlineUser", (data) => {
      console.log("🟢 Online Users:", data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/** Message Component **/}
      <section className={`${basePath && "hidden"}`} >
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img
            src={logo}
            width={250}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  );
};

export default Home;
