import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#e4f5fd] text-[#2a2b3a] text-sm py-8 px-4 sm:px-10 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col items-start">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Site Logo"
              className="h-12 w-auto object-contain mb-2"
            />
          </Link>
          <p className="text-xs text-[#444] max-w-xs">
            Reliable courier and parcel management solution. Fast, secure, and
            professional delivery for your everyday needs.
          </p>
        </div>

        <div className="flex gap-6 text-sm font-medium">
          <Link
            to="/privacy"
            className="hover:text-[#1b6f8f] transition duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="hover:text-[#1b6f8f] transition duration-200"
          >
            Terms of Service
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#1b6f8f] transition duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="mt-6 border-t border-[#cde7f2] pt-4 text-center text-xs text-[#666]">
        &copy; {new Date().getFullYear()} YourCompanyName. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
