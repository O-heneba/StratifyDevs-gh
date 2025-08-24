import React, { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi';
import { GiOrange } from 'react-icons/gi';
import { NavLink } from 'react-router-dom'

const Navbar = () => {

     const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
        {/* Navigation */}
              <nav className="bg-white shadow-md fixed w-full z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <GiOrange className="text-3xl text-orange-500 mr-2" />
                    <span className="text-2xl font-bold text-orange-500">Belee</span>
                  </div>
                  
                  <div className="hidden md:flex space-x-8">
                    <NavLink to="/" className="text-orange-500 font-medium">Home</NavLink>
                    <NavLink to="/dashboard" className="text-orange-500 font-medium">Dashboard</NavLink>
                    <NavLink to="/upload-pdf" className="text-orange-500 font-medium">Upload PDF</NavLink>
                   
                    
                  </div>
                  
                  <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                  </button>
                </div>
                
                {/* Mobile Menu */}
                {menuOpen && (
                  <div className="md:hidden bg-white py-4 px-6 shadow-lg">
                    <NavLink to="/home" className="block py-2 text-orange-500 font-medium">Home</NavLink>
                    <NavLink to="/dashboard" className="block py-2 hover:text-orange-500 transition">Dashboard</NavLink>
                    <NavLink to="/upload-pdf" className="block py-2 hover:text-orange-500 transition">Upload PDF</NavLink>
                  </div>
                )}
              </nav>
    </div>
  )
}

export default Navbar