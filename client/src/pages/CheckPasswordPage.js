import React, { useEffect, useState } from 'react'
//import { IoClose } from "react-icons/io5";
import { Link, useLocation,useNavigate } from 'react-router-dom';
//import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
//import { PiUserCircle } from "react-icons/pi";
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken,setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data,setData] = useState({
    password : "",
    userId: ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!location?.state?._id) {
        toast.error('User ID is missing. Redirecting...');
        navigate('/email');
    }
}, [location, navigate]);

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    if (!location?.state?._id) {
        toast.error("User ID not found! Please try again.");
        return;
    }

    try {  
        const response = await axios.post(URL, {
            userId: location.state._id, // ✅ Ensure this is valid
            password: data.password
        }, {
            withCredentials: true
        });

        if (response.data.success) {
            dispatch(setToken(response.data.token));
            localStorage.setItem('token', response.data.token);

            toast.success(response.data.message);
            setData({ password: "" });
            navigate('/');
        }
    } catch (error) {
        console.error("API Error:", error?.response?.data); // Debugging
        toast.error(error?.response?.data?.message || "Something went wrong!");
    }
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 bg-gray-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden p-6">
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          <Avatar width={70} height={70} name={location?.state?.name} 
          imageUrl={location?.state?.profile_pic}
          /><br/>
          <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
        </div>
    

          {/*<h3>Welcome to Chat app!</h3>*/}

          <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
              

              <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password: </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
               className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
              >
                Login
              </button>

          </form>

          <p className='my-3 text-center'><Link to={"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password ?</Link></p>
        </div>
    </div>
  )
}

export default CheckPasswordPage