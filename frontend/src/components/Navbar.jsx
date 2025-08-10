import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Use 'react-router-dom' for routing
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/userRedux";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const isLoggedIn = user?.currentUser;
  const username = user?.currentUser?.fullname || "Guest";
  const userRole = user?.currentUser?.role;

  const isProfilePage = location.pathname === "/profile";
  const isMyParcelsPage = location.pathname === "/myparcels";

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/"); // Redirect to home page after logging out
  };

  return (
    <header className="h-[80px] bg-[#e4f5fd] flex items-center justify-between px-6 sm:px-10 shadow-md z-50 relative">
      <Link to="/">
        <img src="/logo.png" alt="Site Logo" className="h-[100px] w-auto object-contain" />
      </Link>

      {isLoggedIn ? (
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button className="flex items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="font-medium hidden sm:block text-gray-800">{username}</span>
            <img src="/avatar.png" alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-gray-300" />
          </button>
          {dropdownOpen && (
            <div className="absolute bg-[#53ddf5] text-[#fff] top-14 right-0 w-44 font-bold border border-gray-200 rounded-lg shadow-lg text-sm z-50">
              {!isProfilePage && (
                <Link to="/profile" className="block px-4 py-2 hover:bg-[#66e8ff] transition">Profile</Link>
              )}
              {!isMyParcelsPage && (
                <Link to="/myparcels" className="block px-4 py-2 hover:bg-[#66e8ff] transition">My Parcels</Link>
              )}
              {userRole === "customer" && (
                <Link to="/bookparcel" className="block px-4 py-2 hover:bg-[#66e8ff] transition">Book Parcel</Link>  
              )}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-[#66e8ff] transition">Logout</button>
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
