import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStore } from '../store/store.js'

function Frame() {
  return (
    <div className="h-screen max-w-screen-xl mx-auto flex flex-col xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <Navbar />
      <div className="content flex-1 overflow-y-auto md:overflow-hidden"> {/* flex-1 is used to make the content div take up the remaining space */} 
        <Outlet /> {/* Outlet will be used to render the child components of this current route */}
      </div>
    </div>
  )
}

function AuthPage() {
  const {user} = useStore();
  
  if(!user) return <Navigate to={'/login'} />
  
  else {
    return (
      <div className="h-screen max-w-screen-xl mx-auto flex flex-col xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm">
        <Navbar />
        <div className="content flex-1 overflow-y-auto md:overflow-hidden"> {/* flex-1 is used to make the content div take up the remaining space */} 
          <Outlet /> {/* Outlet will be used to render the child components of this current route */}
        </div>
    </div>
    );
  }
}

export { Frame, AuthPage };