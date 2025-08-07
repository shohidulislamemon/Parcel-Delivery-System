import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 hidden md:flex items-center justify-center bg-[#1f1f2f]">
        <img
          src="/loginlogo.png"
          alt="Login illustration"
          className="max-w-[80%] h-auto object-contain"
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#2f3041] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-white space-y-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center tracking-wide">
            <span className="text-white">Log in to </span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] via-[#24bfd7] to-[#0ff] drop-shadow-[0_1px_4px_rgba(36,191,215,0.8)]">
              Excel
            </span>
            <span className="text-[#24bfd7] ml-1 relative after:content-['BD'] after:absolute after:left-0 after:top-0 after:text-white after:blur-sm after:opacity-30 pointer-events-none">
              <span className="text-[#24bfd7]">BD</span>
            </span>
          </h1>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-[#1f1f2f] text-white rounded-md border border-[#3c3e52] focus:outline-none focus:ring-2 focus:ring-[#24bfd7] placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-300">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#1f1f2f] text-white rounded-md border border-[#3c3e52] focus:outline-none focus:ring-2 focus:ring-[#24bfd7] placeholder-gray-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full text-white py-3 bg-[#1992a4] font-semibold rounded-full hover:bg-[#24bfd7] transition duration-200">
              Login
            </button>
            <Link to="/">
              <button className="w-full py-3 border border-gray-400 text-gray-300 rounded-full hover:bg-[#1f1f2f] transition duration-200">
                Go back
              </button>
            </Link>
          </div>

          <p className="text-sm text-gray-400 text-center">
            Don’t have an account?{" "}
            <a href="/register" className="text-[#24bfd7] hover:underline">
              Sign up
            </a>
          </p>

          <p className="text-xs text-gray-500 text-center mt-8">
            By continuing, you agree to our{" "}
            <a href="/terms" className="hover:underline text-[#24bfd7]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="hover:underline text-[#24bfd7]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
