import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="h-[80px] bg-[#fff] flex items-center justify-between px-6 sm:px-10 shadow-md">
      <Link to="/">
        <img
          src="/logo.png"
          alt="Site Logo"
          className="h-[100px] w-auto object-contain"
        />
      </Link>
      <Link to="/login">
        <button className="bg-[#2a2b3a] text-white hover:bg-[#1f202d] active:bg-[#181923] px-5 py-2 rounded-lg shadow-md font-medium transition duration-200">
          Login
        </button>
      </Link>
    </header>
  );
};

export default Navbar;
