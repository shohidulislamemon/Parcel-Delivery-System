import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="h-[80px] bg-[#e4f5fd] flex items-center justify-between px-6 sm:px-10 shadow-md">
      <Link to="/">
        <img
          src="/logo.png"
          alt="Site Logo"
          className="h-[100px] w-auto object-contain"
        />
      </Link>
      <button className="text-lg font-semibold text-[#2596be] hover:text-[#1b6f8f] transition duration-200">
        Logout
      </button>
    </header>
  );
};

export default Navbar;
