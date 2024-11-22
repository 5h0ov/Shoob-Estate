import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import { useStore } from "../store/store.js"
import TranslateWidget from "./TranslateWidget.jsx";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useStore()
  const { notifications, fetchNotifications, fetchingNotifications } = useStore();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);
  
  return (
    <nav className="h-24 flex justify-between items-center px-4">
      <div className="left flex-1 flex items-center gap-12">
        <Link to={`/`} aria-label="home" className="logo flex items-center gap-1 font-bold text-xl">
          <img src="./logo.png" alt="" className="w-7" />
          <span className="hidden md:inline sm:inline">ShoobEstate</span>
        </Link>

        <Link to="/" className="nav-link hidden sm:inline font-semibold">Home</Link>
        <Link to="/about" className="nav-link hidden sm:inline font-semibold">About</Link>
        <Link to="/contact" className="nav-link hidden sm:inline font-semibold">Contact</Link>
        <Link to="/agents" className="nav-link hidden sm:inline font-semibold">Agents</Link>
      </div>
      <div className="right flex-1 flex h-full items-center justify-end md:bg-[#fcf5f3] gap-2 bg-transparent z-10">

        {user ? (
          <div className="user md:flex items-center font-bold hidden">
            <img
              src={user.avatar || "./blank_avatar.png"}
              alt=""
              className="w-12 h-12 rounded-full object-cover mr-5 nav-link hover:scale-125"
            />
            <span className="hidden lg:inline mr-2">{user.username}</span>
            <Link to="/profile" className="profile relative px-6 py-3 bg-[#fece51] cursor-pointer border-none nav-link">
              {notifications > 0 && <div className="notification absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">{fetchingNotifications? "..." : notifications}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login" className="font-semibold px-6 py-3 mx-5 whitespace-nowrap">Sign in</Link>
            <Link to="/signup" className="font-semibold  px-6 py-3 mx-5 bg-[#fece51] whitespace-nowrap">Sign up</Link>
          </>
        )}
        <TranslateWidget /> 

        <div className="lg:hidden inline z-50 nav-link hover:scale-110">
          <TiThMenu className={`size-10 cursor-pointer transition-all duration-150 ease-in-out ${open ? "invert" : "text-black"}`} onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={`menu ${open ? "translate-x-0" : "translate-x-full"} fixed top-0 right-0 bg-black/80 backdrop-blur-md text-white h-screen w-1/2 transition-all duration-500 ease-in-out flex flex-col lg:hidden items-center justify-center text-2xl gap-14 font-semibold `} 
          onClick={(event) => {
            if (event.target.classList.contains('nav-link') || event.target.closest('.profile')) {
              setOpen(false);
            }
          }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/agents" className="nav-link">Agents</Link>
          {!user ? (
            <>
              <Link to="/login" className="nav-link">Sign in</Link>
              <Link to="/signup" className="nav-link">Sign up</Link>
            </>
          ) : (
            <div className="flex flex-row items-center">
              <img
                src={user.avatar || "./blank_avatar.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover mr-5 nav-link hover:scale-125"
              />
              <Link
                to="/profile"
                className="profile relative px-3 py-2 bg-[#fece51] cursor-pointer border-none nav-link"
              >
                {notifications > 0 && <div className="notification absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                {fetchingNotifications? "..." : notifications}</div>}
                <span>Profile</span>  
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;