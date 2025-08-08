import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = true;
  const username = "Shohidul Islam";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[80px] bg-[#e4f5fd] flex items-center justify-between px-6 sm:px-10 shadow-md z-50 relative">
      {/* Logo */}
      <Link to="/">
        <img
          src="/logo.png"
          alt="Site Logo"
          className="h-[100px] w-auto object-contain"
        />
      </Link>

      {/* User section */}
      {isLoggedIn ? (
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button className="flex  items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="font-medium hidden sm:block text-gray-800">
              {username}
            </span>
            <img
              src="/avatar.png"
              alt="Avatar"
              className="h-10 w-10 rounded-full object-cover border border-gray-300"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute bg-[#53ddf5] text-[#fff] top-14 right-0 w-44 font-bold border border-gray-200 rounded-lg shadow-lg text-sm z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-[#66e8ff] transition"
              >
                Profile
              </Link>
              <Link
                to="/myparcels"
                className="block px-4 py-2 hover:bg-[#66e8ff]  transition"
              >
                My Parcels
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="w-full text-left px-4 py-2 hover:bg-[#66e8ff]  transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login">
          <button className="bg-[#2a2b3a] text-white hover:bg-[#1f202d] active:bg-[#181923] px-5 py-2 rounded-lg shadow-md font-medium transition duration-200">
            Login
          </button>
        </Link>
      )}
    </header>
  );
};

export default Navbar;
