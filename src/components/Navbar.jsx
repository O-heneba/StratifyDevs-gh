import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { GiOrange } from "react-icons/gi";
import {
  FaHome,
  FaTachometerAlt,
  FaFileUpload,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaRobot,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../AUTH/firebase-auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
   const [refreshCount, setRefreshCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to refresh after 100ms
    const timer = setTimeout(() => {
      setRefreshCount(prev => prev + 1);
      console.log('refreshed')
    }, 3000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on mount

  const logOutFunc = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      setMenuOpen(false);
    } catch (err) {
      console.log(err);
    } // close menu after logout
  };

  // Desktop link styles
  const linkClasses = ({ isActive }) =>
    isActive
      ? "text-orange-600 font-bold text-xl"
      : "text-orange-500 font-medium hover:text-orange-600 transition";


  // Mobile link styles
  const mobileLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center p-3 rounded-xl shadow-md transition transform hover:scale-105 
    ${
      isActive
        ? "bg-orange-100 text-orange-600 font-bold"
        : "bg-gray-100 text-gray-700 hover:bg-orange-50"
    }`;

  const mobileLogoutClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center p-3 rounded-xl shadow-md transition transform hover:scale-105 
    ${
      isActive
        ? "bg-red-100 text-red-600 font-bold"
        : "bg-gray-100 text-red-500 hover:bg-red-50"
    }`;

  return (
    <div>
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
           <img src='/belee-logo.png' alt='Belee Restaurant Logo' className="w-10 h-10"/>
            <span className="text-2xl font-bold text-orange-500">Belee</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" className={linkClasses}>
              Home
            </NavLink>
            {auth.currentUser && <NavLink to="/dashboard" className={linkClasses}>
              Dashboard
            </NavLink>}

            {auth.currentUser && <NavLink to="/upload-pdf" className={linkClasses}>
              Upload PDF
            </NavLink>}

            {!auth.currentUser && <NavLink to="/login" className='font-bold bg-blue-500 rounded-md p-2 text-white'>
              LogIn
            </NavLink>}


            {auth.currentUser && <NavLink to="/register" className={linkClasses}>
              Register Branch
            </NavLink>}

            {auth.currentUser && <NavLink to="/ai-advice" className={linkClasses}>
              AI Advice
            </NavLink>}

          {auth.currentUser && <NavLink onClick={logOutFunc} to="#" className='font-bold bg-red-500 rounded-md p-2 text-white'>
              Log Out
            </NavLink>}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white py-6 px-6 shadow-lg grid grid-cols-2 gap-4">
            <NavLink
              to="/"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaHome className="text-xl mb-1" />
              Home
            </NavLink>

            {auth.currentUser && <NavLink
              to="/dashboard"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaTachometerAlt className="text-xl mb-1" />
              Dashboard
            </NavLink>}

            {auth.currentUser && <NavLink
              to="/upload-pdf"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaFileUpload className="text-xl mb-1" />
              Upload PDF
            </NavLink>}

            {!auth.currentUser && <NavLink
              to="/login"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaSignInAlt className="text-xl mb-1" />
              Login
            </NavLink>}

            {
              auth.currentUser && <NavLink
              to="/register"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaUserPlus className="text-xl mb-1" />
              Add Branch
            </NavLink>
            }

            {
              auth.currentUser && <NavLink
              to="/ai-advice"
              className={mobileLinkClasses}
              onClick={() => setMenuOpen(false)}
            >
              <FaRobot className="text-xl mb-1" />
              AI Advice
            </NavLink>
            }

            

            {auth.currentUser && <NavLink
              onClick={logOutFunc}
              to="#"
              className={mobileLogoutClasses}
            >
              <FaSignOutAlt className="text-xl mb-1" />
              Log Out
            </NavLink>}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
