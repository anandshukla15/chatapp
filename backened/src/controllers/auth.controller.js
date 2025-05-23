import e from "express";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'; // or const bcrypt = require('bcryptjs');

import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";

export const signup = async(req, res) => {
  const { fullName, email, password } = req.body;
  try{
if(!fullName || !email || !password){
  return res.status(400).json({message: "All fields are required"});
}

    if(password.length < 6){
      return res.status(400).json({message: "Password must be atleast 6 characters long"});
    }

const user= await User.findOne({email});

if(user){
  return res.status(400).json({message: "User already exists"});
}

const salt= await bcrypt.genSalt(10);
const hashedPassword= await bcrypt.hash(password, salt);

const newUser= new User({
  fullName,
  email,
  password: hashedPassword,
});

if(newUser){
  //generate jwt token here
  generateToken(newUser._id, res);
  await newUser.save();

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic,
  })
}else{
  return res.status(400).json({message: "invalid user data"});
}

  }catch(error){
    console.log("error in signup ",error.message);
    res.status(500).json({message: "Something went wrong internal server error"});
  }
}

export const login = async(req, res) => {
   const { email, password } = req.body;
  try{
    const user= await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "invalid credintels"});
    }

    const isPasswordValid= await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(400).json({message: "invalid credintels"});
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
created: user.createdAt,
    })

  }catch(error){
    console.log("error in login ",error.message);
    res.status(500).json({message: "internal server error"});
  }
  };

  export const logout= (req, res) => {
    try{
      res.cookie("jwt", "", {maxAge: 0});
      res.status(200).json({message: "logged out"});}
    catch(error){
      console.log("error in logout ",error.message);
      res.status(500).json({message: "internal server error"}); }
  }

  export const updateProfile= async(req, res) => {
    try{
      const {profilePic}= req.body;
      const userId = req.user._id;
      if(!profilePic){
        return res.status(400).json({message: "profilePic is required"});
      }
      const uploadResponse= await cloudinary.uploader.upload(profilePic);
      const updatedUser= await User.findByIdAndUpdate(
        userId,
        {
          profilePic: uploadResponse.secure_url
        },
        {new: true}
      );
      res.status(200).json(updatedUser);
    } catch(error){
      console.log("error in updateProfile ",error.message);
      res.status(500).json({message: "internal server error"});
    }
  }

  export const checkAuth= async(req, res) => {
    try{
      res.status(200).json(req.user);
    }catch(error){
      console.log("error in checkAuth ",error.message);
      res.status(500).json({message: "internal server error"});
    }
  }