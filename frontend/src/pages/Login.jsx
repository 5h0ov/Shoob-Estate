import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../store/store.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

const Login = () => {  const windowUrl = window.location.search;  // gets the query string from the url
  const searchParams = new URLSearchParams(windowUrl);  // creates a new URLSearchParams object
  const emailValue = searchParams.get("email"); // gets the value of the email parameter from the query string
  const [email, setEmail] = useState(emailValue || "");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useStore();
  const [errorMsg , setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if(res) {
      if(res.success) {
        return;
      }
      setErrorMsg(res.message);
    } 
  }

  
  return (
    <div className="h-full flex">
      <div className="flex-1 h-full flex items-center justify-center">
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <h1 className='text-2xl font-bold'>Welcome back,</h1>
          <input
            name="email"
            required
            minLength={3}
            type="text"
            value={email}
            placeholder="Email"
            className="p-5 border border-gray-400 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input  
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              placeholder="••••••••"
              className="p-5 border border-gray-400 rounded-md"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              disabled={password.length === 0}
              aria-label='Toggle Password Visibility'
              id="password-toggle"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
            <Tooltip anchorSelect='#password-toggle' place='right' effect='solid' type='dark'>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Tooltip>
          </div>
          <button
            disabled={isLoggingIn}
            className={`p-5 rounded-md border-none text-white font-bold cursor-pointer ${isLoggingIn ? 'bg-gray-300 cursor-no-drop' : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-all duration-100'}`}
          >
            Login
          </button>

          <Link to={email ? `/signup?email=${email}` : `/signup`} className="text-sm text-gray-500 hover:border-b hover:border-gray-500 w-max underline">
            Don't have an account?
          </Link>
        </form>
      </div>
      <div className=" bg-[#fcf5f3] relative hidden md:flex flex-1 items-center">
        <img
          src="./bg.png"
          alt=""
          className="absolute right-0 w-[115%] lg:w-[105%]"
        />
      </div>
    </div>
  );
}

export default Login;