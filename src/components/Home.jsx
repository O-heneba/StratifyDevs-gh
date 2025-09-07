/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FiMenu, FiX, FiPhone, FiMapPin, FiClock, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { MdDeliveryDining } from 'react-icons/md';
import { GiChefToque, GiOrange } from 'react-icons/gi';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';



const Home = () => {
 
 
  return (
    <div className="font-sans text-gray-800">

  
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-orange-600 mb-6">Taste the <span className="text-white bg-orange-500 px-2 rounded">Sunshine</span></h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Authentic flavors crafted with passion. Belee brings you the freshest ingredients with a modern twist.
            </p>
            {/* <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center">
              <MdDeliveryDining className="mr-2" /> Order Now
            </button> */}
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="w-full h-80 md:h-96 bg-orange-200 rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Restaurant interior" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center">
                  <GiChefToque className="text-2xl text-orange-500 mr-2" />
                  <div>
                    <p className="font-bold">Chef's Special</p>
                    <p className="text-sm text-gray-600">Orange Glazed Salmon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

   
      <section id="about" className="py-20 bg-orange-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6">Our Story</h2>
              <div className="w-20 h-1 bg-orange-400 mb-6"></div>
              <p className="text-gray-700 mb-6">
                Founded in 2015, Belee began as a small family-owned bistro with a passion for fresh, vibrant flavors. 
                Our name comes from the French word "belle" meaning beautiful, combined with our signature ingredient - the orange.
              </p>
              <p className="text-gray-700 mb-8">
                Today, we've grown into a beloved neighborhood restaurant while maintaining our commitment to quality ingredients 
                and warm hospitality. Every dish tells a story of tradition meeting innovation.
              </p>
              {/* <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300">
                Meet Our Chef
              </button> */}
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64 bg-orange-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Chef cooking" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 bg-orange-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Restaurant dish" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 bg-orange-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Restaurant interior" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 bg-orange-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" 
                    alt="Dining experience" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">Visit Us</h2>
            <div className="w-20 h-1 bg-orange-400 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We'd love to welcome you to Belee. Reserve a table or get in touch with any questions.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="bg-orange-50 rounded-xl p-8 h-full">
                <h3 className="text-2xl font-bold text-orange-600 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <FiMapPin className="text-orange-500 text-xl mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-gray-800">Address</h4>
                      <p className="text-gray-600">123 Sunshine Avenue, Orangeville, CA 92865</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiPhone className="text-orange-500 text-xl mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-gray-800">Phone</h4>
                      <p className="text-gray-600">(714) 555-0123</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiClock className="text-orange-500 text-xl mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-gray-800">Hours</h4>
                      <p className="text-gray-600 mb-1">Monday - Friday: 11am - 10pm</p>
                      <p className="text-gray-600">Saturday - Sunday: 10am - 11pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-bold text-gray-800 mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-orange-100 hover:bg-orange-200 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 transition">
                      <FiInstagram size={20} />
                    </a>
                    <a href="#" className="bg-orange-100 hover:bg-orange-200 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 transition">
                      <FiFacebook size={20} />
                    </a>
                    <a href="#" className="bg-orange-100 hover:bg-orange-200 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 transition">
                      <FiTwitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-orange-50 rounded-xl p-8 h-full">
                <h3 className="text-2xl font-bold text-orange-600 mb-6">Make a Reservation</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Time</label>
                      <input type="time" className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Special Requests</label>
                    <textarea rows="3" className="w-full px-4 py-3 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"></textarea>
                  </div>
                  <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 w-full">
                    Reserve Table
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              {/* <GiOrange className="text-3xl mr-2" /> */}
              <img src='belee-logo-white.png' className='w-20 h-20' alt='white logo'/>
              <span className="text-2xl font-bold hidden">Belee</span>
            </div>
            
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#home" className="hover:text-orange-200 transition">Home</a>
              <NavLink to="/dashboard" className="hover:text-orange-200 transition">Dashboard</NavLink>
              <a href="#about" className="hover:text-orange-200 transition">About</a>
              {/* <a href="#contact" className="hover:text-orange-200 transition">Contact</a> */}
            </div>
            
            {/* <div className="flex space-x-4">
              <a href="#" className="bg-orange-700 hover:bg-orange-800 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="bg-orange-700 hover:bg-orange-800 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="bg-orange-700 hover:bg-orange-800 w-10 h-10 rounded-full flex items-center justify-center transition">
                <FiTwitter size={20} />
              </a>
            </div> */}
          </div>
          
          <div className="border-t border-orange-500 mt-8 pt-8 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Belee Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;