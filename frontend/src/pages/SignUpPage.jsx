import React from 'react'
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';

const SignUpPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    
  });

const {signup,isSigningUp} = useAuthStore();

const validateForm = () => {};
const handleFormSubmit = (e) => { 
  e.preventDefault();};

  return (
    <div>
      Signup
    </div>
  )
}

export default SignUpPage
