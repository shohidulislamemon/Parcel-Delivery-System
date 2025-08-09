import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

import { publicRequest } from "../requestMethods";

const statusMap = {
  1: "Pending",
  2: "In Transit",
  3: "Delivered",
  4: "Cancelled",
  5: "Returned",
};

const ParcelDetails = () => {
  const [parcel, setParcel] = useState({});
  const location = useLocation();

  const parcelId = location.pathname.split("/")[2];

  useEffect(() => {
    const getParcel = async () => {
      try {
        const res = await publicRequest.get(`/parcels/find/${parcelId}`);
        setParcel(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getParcel();
  }, [parcelId]);

  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted feedback:", feedback);
    alert("Thank you for your feedback!");
    setFeedback("");
  };

  // Determine status label from numeric status
  const statusLabel = statusMap[parcel.status] || "Unknown";

  // Show feedback form only for Delivered (3), Cancelled (4), Returned (5)
  const showFeedbackForm = [3, 4, 5].includes(parcel.status);

  return (
    <div className="w-[90%] sm:w-[60%] md:w-[55%] mt-10 mx-auto bg-[#1f1f2f] text-white p-6 rounded-xl shadow-md">
      <Link
        to="/myparcels"
        className="flex items-center text-[#24bfd7] mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to My Parcels
      </Link>

      <h2 className="text-2xl font-semibold text-[#24bfd7] mb-6">
        Parcel Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
        <p>
          <span className="font-medium text-gray-400">Tracking ID:</span>{" "}
          {parcel._id}
        </p>
        <p>
          <span className="font-medium text-gray-400">Status:</span>{" "}
          {statusLabel}
        </p>
        <p>
          <span className="font-medium text-gray-400">From:</span> {parcel.from}
        </p>
        <p>
          <span className="font-medium text-gray-400">To:</span> {parcel.to}
        </p>
        <p>
          <span className="font-medium text-gray-400">Sender:</span>{" "}
          {parcel.senderName}
        </p>
        <p>
          <span className="font-medium text-gray-400">Recipient:</span>{" "}
          {parcel.recipientName}
        </p>
        <p>
          <span className="font-medium text-gray-400">Weight:</span>{" "}
          {parcel.weight}Kg
        </p>
        <p>
          <span className="font-medium text-gray-400">Cost:</span> {parcel.cost}
        </p>
        <p>
          <span className="font-medium text-gray-400">Date:</span> {parcel.date}
        </p>
      </div>

      {showFeedbackForm && (
        <form onSubmit={handleSubmit} className="mt-8">
          <label className="block mb-2 text-gray-300">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full p-3 bg-[#2a2b3a] rounded-md text-white focus:ring-2 focus:ring-[#24bfd7] resize-none"
            rows="4"
          ></textarea>

          <button
            type="submit"
            className="mt-4 bg-[#24bfd7] hover:bg-[#1ca5b8] px-6 py-2 rounded-md text-white transition"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default ParcelDetails;
