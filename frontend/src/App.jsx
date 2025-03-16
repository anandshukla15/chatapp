import { useState } from 'react'
import React from 'react'
import Navbar from './components/Navbar'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage' 
import SignupPage from './pages/SignUpPage'
import {Loader } from "lucide-react";
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
//import { useThemeStore } from './store/useThemeStore'


const App = ()=> {
  const {authUser, checkAuth,isCheckingAuth} = useAuthStore();


  const {theme}=useThemeStore();
  
  useEffect(() => {
    checkAuth();
  }
  , [checkAuth]);
  console.log({authUser}
  );

if(isCheckingAuth && !authUser){
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className='size-10 animate-spin' />
    </div>
  );}

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser? <HomePage />:<Navigate to="/login"/>} />
        <Route path="/login" element={!authUser? <LoginPage />:<Navigate to="/"/>} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} /> 
        <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to="/login"/>} />
        </Routes> 

        <Toaster />
    </div>

  );  
};

export default App
{/* <button className="btn btn-neutral">Neutral</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-info">Info</button>
<button className="btn btn-success">Success</button>
<button className="btn btn-warning">Warning</button>
<button className="btn btn-error">Error</button> */}

 