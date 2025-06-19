import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/Signup';
import SignIn from './pages/Signin';
import Customise from './pages/Customise';
import Home from './pages/Home';
import { userDataContext } from './context/UserContext';
import Customise2 from './pages/Customise2';
import History from './pages/History';

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName
            ? <Home />
            : <Navigate to="/customise" />
        }
      />
      <Route
        path="/signup"
        element={
          !userData ? <SignUp /> : <Navigate to="/" />
        }
      />
      <Route
        path="/signin"
        element={
          !userData ? <SignIn /> : <Navigate to="/" />
        }
      />
      <Route
        path="/customise"
        element={
          userData ? <Customise /> : <Navigate to="/signup" />
        }
      />
      <Route
        path="/customise2"
        element={
          userData ? <Customise2 /> : <Navigate to="/signup" />
        }
      />
      <Route 
      path="/history" 
      element={<History />} 
      />
    </Routes>
    
  );
}

export default App;
