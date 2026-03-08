import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. useLocation import kiya
import { FaCode, FaSignOutAlt, FaHome, FaLayerGroup } from 'react-icons/fa';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Current URL pata karne ke liye
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome back! 👋");
    } catch (error) {
      toast.error("Login Failed 😢");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to check active link
  const isActive = (path) => {
    return location.pathname === path ? "text-primary font-bold" : "text-gray-400 hover:text-white";
  };

  return (
    <nav className="bg-darkLight border-b border-gray-800 py-3 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition">
          <FaCode className="text-primary" />
          <span>Code<span className="text-primary">Stash</span></span>
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center gap-6">
          
          {/* Home Link with Active Logic */}
          <Link to="/" className={`text-sm flex items-center gap-1 transition ${isActive('/')}`}>
            <FaHome /> Home
          </Link>

          {/* Library Link with Active Logic */}
          <Link to="/dashboard" className={`text-sm flex items-center gap-1 transition ${isActive('/dashboard')}`}>
             <FaLayerGroup /> Library
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
              <div className="flex items-center gap-2">
                <img 
                  src={user.photoURL} 
                  alt="User" 
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition text-xs"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-white text-dark px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition flex items-center gap-2 ml-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="G" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;