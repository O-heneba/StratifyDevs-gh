/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../AUTH/firebase-auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branchName, setBranchName] = useState('');
  const [location, setLocation] = useState('');
  const [telephone, setTelePhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerFunc = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc = doc(db, 'users', res.user.uid); // Fixed: use res.user.uid

      const data = {
        branchName,
        telephone,
        location,
        files: [],
        createdAt: Date.now()
      };
      
      await setDoc(userDoc, data);
      // Optionally redirect user or show success message
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 mt-20"
      >
        <h1 className="text-3xl font-bold text-center text-orange-600">
          🍴 Create new branch
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Add a new branch and assign manager
        </p>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={registerFunc}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Branch Manager's Email
            </label>
            <input
              type="email"
              onChange={(e) => { setEmail(e.target.value) }}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              required
              onChange={(e) => { setPassword(e.target.value) }}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Branch Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Branch Name
            </label>
            <input
              required
              onChange={(e) => { setBranchName(e.target.value) }}
              type="text"
              placeholder="Enter branch name"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              required
              onChange={(e) => { setLocation(e.target.value) }}
              type="text"
              placeholder="Enter location"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* telephone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Telephone
            </label>
            <input
              required
              onChange={(e) => { setTelePhone(e.target.value) }}
              type="tel"  // Changed from "number" to "tel"
              placeholder="Enter telephone number"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        
      </motion.div>
    </div>
  );
}