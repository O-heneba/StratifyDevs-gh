/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../AUTH/firebase-auth";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  const logInFunc = async(e) =>{
    e.preventDefault()
    try{
      const res = await signInWithEmailAndPassword(auth,email,password)
      navigate('/')
    console.log(res)
    }catch(err){
      console.log(err)
      
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600">
          🍴 Welcome Back
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Sign in to your Restaurant App
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              required
              onChange={(e)=>{setEmail(e.target.value)}}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              onChange={(e)=>{setPassword(e.target.value)}}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            onClick={logInFunc}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>

        {/* <p className="text-sm text-center mt-4 text-gray-500">
          Don’t have an account?{" "}
          <a href="#" className="text-orange-600 hover:underline">
            Sign Up
          </a>
        </p> */}
      </motion.div>
    </div>
  );
}
