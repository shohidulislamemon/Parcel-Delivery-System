// src/pages/Profile.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";

const getInitials = (nameOrEmail = "") => {
  const s = String(nameOrEmail).trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s[0].toUpperCase();
};

const Profile = () => {
  const user = useSelector((state) => state.user);
  const current = user?.currentUser || null;

  if (!current) {
    return (
      <div className="w-[90%] sm:w-[60%] md:w-[55%] mt-10 mx-auto bg-[#1f1f2f] text-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-[#24bfd7] mb-4">My Profile</h2>
        <p className="text-sm text-gray-300">
          You’re not logged in. Please{" "}
          <Link to="/login" className="text-[#24bfd7] underline">
            sign in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  // ---- pull fields similar to Navbar style ----
  // name (prefer 'fullname' to match Navbar, then fallbacks)
  const nameFromFull = current.fullname;
  const nameFromParts = [current.firstName, current.lastName].filter(Boolean).join(" ").trim();
  const safeName = nameFromFull || nameFromParts || current.username || current.email || "User";

  const email = current.email || "";
  const phone = current.phone || current.mobile || "";
  const address =
    current.address ||
    [current.city, current.state, current.country].filter(Boolean).join(", ");


  // avatar: follow navbar approach, but allow dynamic user photo if available
  const avatarUrl =
    "/avatar.png";


  return (
    <div className="w-[90%] sm:w-[60%] md:w-[55%] mt-10 mx-auto bg-[#1f1f2f] text-white p-6 rounded-xl shadow-md relative">
      {/* Avatar (top-left, circular) */}
      <div className="absolute left-4 top-4">
        <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#24bfd7] bg-[#2a2b3a] flex items-center justify-center select-none">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={safeName || email || "User avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-semibold">
              {getInitials(safeName || email)}
            </span>
          )}
        </div>
        
      </div>

      {/* Content shifted so it doesn't overlap avatar */}
      <div className="pl-[120px]">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-[#24bfd7] mb-4 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>

          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-2 bg-[#24bfd7] hover:bg-[#1ca5b8] px-4 py-2 rounded-md text-white transition text-sm"
          >
            <FiEdit2 /> Edit Profile
          </Link>
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base mt-6">
          <p>
            <span className="font-medium text-gray-400">Name:</span> {safeName || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-400">Email:</span> {email || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-400">Phone:</span> {phone || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-400">Address:</span> {address || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
