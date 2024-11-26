import React, { Suspense, lazy, Component } from 'react';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Frame } from './layouts/Frame.jsx';

// import CookieConsent from './CookieConsent';
// import UserCheck from './UserCheck';
// import SignUp from './SignUp';
// import AvatarSelect from './AvatarSelect';
// import PlayPage from './PlayPage';
// import Favourite from './Favourite';
// import SearchResults from './SearchResults';
// import UserEdit from './UserEdit';
// import Page404 from './Page404';
import { useStore } from './store/store.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Lists = lazy(() => import('./pages/Lists.jsx'));
const InfoPage = lazy(() => import('./pages/InfoPage.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const CreatePost = lazy(() => import('./pages/CreatePost.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Agents = lazy(() => import('./pages/Agents.jsx'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Check for module loading error
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Failed to load module script')
    ) {
      console.log('Module loading error detected, refreshing page...');
      setTimeout(() => {
        window.location.reload();
      }, 300); // 1.5 second delay before refresh
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center bg-white h-screen">
          <span className='loader' />
        </div>
     )
    }
    return this.props.children;
  }
}

const App = () => {
  const {user, checkingAuth, getAuth, initializeSocket, isConnectingSocket} = useStore();  // checkingAuth acts as a loading state to make an illusion of a loading effect when the user is being checked
  // console.log("The authenticated user: ",user);
  
  useEffect(() => {
    getAuth();  // runs only once when the component mounts
  },[getAuth])  // runs when checkingAuth changes;

  
  useEffect(() => {
    if (user) {
      initializeSocket();
    }
  }, [user, initializeSocket]);



  if(checkingAuth) {
    return (
       <div className="flex justify-center items-center bg-white h-screen">
        <span className='loader' />
      </div>
    )
  }
  
  return (
    <>
      <ErrorBoundary>
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* <CookieConsent /> */}
      <Suspense fallback={<div className="flex justify-center items-center bg-white h-screen">
        <span className='loader' /> 
      </div>}>
        <Routes>
          <Route path='/' element={<Frame />}>
            <Route index element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/list' element={<Lists />} />
            <Route path='/agents' element={<Agents />} />
            <Route path='/:id' element={<InfoPage />} />
            <Route path='/create-post' element={user? <CreatePost /> : <Navigate to={"/login"} />} />
            <Route path='/login' element={!user? <Login />: <Navigate to={"/"} />} />
            <Route path='/signup' element={!user? <SignUp />: <Navigate to={"/"} />} />
            <Route path='/profile' element={user? <Profile />: <Navigate to={"/login"} />} />
          </Route>
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default App;