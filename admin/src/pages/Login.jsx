import React from "react";
import { FaUser, FaLock, } from "react-icons/fa";
import Footer from "../components/Footer";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#2a2b3a] text-white">
      {/* Title */}
      <header className="text-center py-4 text-3xl font-bold">
        Admin Login
      </header>

      <div className="flex flex-1 items-center justify-center pb-3">
        <div className="flex w-[85%] max-w-5xl shadow-2xl rounded-lg overflow-hidden bg-[#2f3041]">
          {/* Left Image */}
          <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#2f3041] p-6">
            <img
              src="/loginimg.png"
              alt="login"
              className="object-cover w-full h-full rounded-md"
            />
          </div>

          <div className="w-full md:w-1/2 bg-[#2f3041] p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Log In</h2>

            <div className="space-y-4">
              <div className="flex items-center border-b-2 border-gray-600 py-2">
                <FaUser className="text-[#2596be] mr-2" />
                <input
                  type="text"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                />
              </div>

              <div className="flex items-center border-b-2 border-gray-600 py-2">
                <FaLock className="text-[#2596be] mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center my-4">
              <input type="checkbox" className="mr-2" />
              <label className="text-gray-400 text-sm">Remember me</label>
            </div>

            <button className="w-full bg-[#2596be] hover:bg-[#1d7aa0] text-white font-semibold py-2 rounded mt-2">
              Log In
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
