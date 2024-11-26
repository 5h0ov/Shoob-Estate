import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/store.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

const SignUp = () => {
  const windowUrl = window.location.search;  // gets the query string from the url
  const searchParams = new URLSearchParams(windowUrl);  // creates a new URLSearchParams object
  const emailValue = searchParams.get("email"); // gets the value of the email parameter from the query string
  const [email, setEmail] = useState(emailValue || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isSigningUp } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg , setErrorMsg] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e) => { 
    e.preventDefault();
    setIsLoading(true);
    const res = await signup({ email, username, password, role });
    if(res) {
      if(res.success) {
        setIsLoading(false);
        return;
      }
      setErrorMsg(res.message);
    }
    setIsLoading(false);
  };
  

  return (
    <div className="h-full flex">
      <div className="flex-1 h-full flex items-center justify-center">
        <form onSubmit={handleSignUp} className="flex flex-col gap-5">
          <h1 className='text-2xl font-bold'>Create an Account</h1>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            className="p-5 border border-gray-400 rounded-md"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            name="email"
            type="text"
            value={email}
            minLength={3}
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
              id='password-toggle'
              disabled={password.length === 0}
              aria-label='Toggle Password Visibility'
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
            <select 
              name="role" 
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border border-gray-400 rounded-md"
            >
              <option value="">No Role Selected</option>
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          <button
            type='submit'
            aria-label='Sign Up'
            disabled={isSigningUp}
            className={`p-5 rounded-md border-none  text-white font-bold cursor-pointer ${isSigningUp ? 'bg-gray-300 cursor-no-drop' : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 transition-all duration-100'}`}
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          {errorMsg && <p className="text-red-500 text-lg font-semibold">{errorMsg}</p>}
          <Link to={email ? `/login?email=${email}` : `/login`} className="text-sm text-gray-500 hover:border-b hover:border-gray-500 w-max underline">
            Do you have an account?
          </Link>
        </form>
      </div>
      <div className="flex-1 bg-[#fcf5f3] hidden md:flex items-center justify-center">
        <img src="./bg.png" alt="" className="w-full" />
      </div>
    </div>
  );
}

export default SignUp;