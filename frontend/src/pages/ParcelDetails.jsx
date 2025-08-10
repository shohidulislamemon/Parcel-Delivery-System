// src/pages/ParcelDetails.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";
import { socket, joinParcelRoom, leaveParcelRoom } from "../socket";
import QRCode from "react-qr-code";

const statusMap = {
  0: "Pending",
  1: "Pending",
  2: "Assigned to Delivery Agent",
  3: "Delivered",
  4: "Delivered & Mail sent",
  5: "Returned",
};

const ParcelDetails = () => {
  const [parcel, setParcel] = useState({});
  const [feedback, setFeedback] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const current = useSelector((s) => s.user.currentUser) || {};
  const isDeliveryAgent =
    current?.isDeliveryAgent === true ||
    /delivery-agent|agent/i.test(current?.role || "");

  const parcelId = location.pathname.split("/")[2];

  // initial load
  useEffect(() => {
    const getParcel = async () => {
      try {
        const res = await publicRequest.get(`/parcels/find/${parcelId}`);
        setParcel(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (parcelId) getParcel();
  }, [parcelId]);

  // live: join parcel room + listen
  useEffect(() => {
    if (!parcelId) return;

    joinParcelRoom(parcelId);

    const onUpdated = (p) => {
      if (String(p._id) !== String(parcelId)) return;
      setParcel((prev) => ({ ...prev, ...p }));
    };
    const onDeleted = (p) => {
      if (String(p._id) !== String(parcelId)) return;
      // go back to my parcels if this one is deleted
      navigate("/myparcels", { replace: true });
    };

    socket.on("parcel:updated", onUpdated);
    socket.on("parcel:deleted", onDeleted);

    return () => {
      socket.off("parcel:updated", onUpdated);
      socket.off("parcel:deleted", onDeleted);
      leaveParcelRoom(parcelId);
    };
  }, [parcelId, navigate]);

  // Agent-only quick status change (Delivered/Returned)
  const locked = [3, 4, 5].includes(Number(parcel.status));
  const handleAgentStatusChange = async (nextCode) => {
    if (locked) return;
    const next = Number(nextCode);
    if (![3, 5].includes(next)) return;
    if (next === Number(parcel.status ?? 0)) return;

    try {
      await publicRequest.put(`/parcels/${parcelId}`, { status: next });
      // state will also update from socket event
    } catch (err) {
      console.log(err);
    }
  };

  const statusLabel = statusMap[parcel.status] || "Unknown";

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    setFeedback("");
  };

  const showFeedbackForm = !isDeliveryAgent && [3, 4, 5].includes(Number(parcel.status));

  // ===== QR value (encode just the parcel ID) =====
  const qrValue = parcelId ? String(parcelId) : "";

  return (
    <div className="w-[90%] sm:w-[60%] md:w-[55%] mt-10 mx-auto bg-[#1f1f2f] text-white p-6 rounded-xl shadow-md relative">
      {/* Top-left QR code */}
      {qrValue && (
        <div className="absolute left-4 top-4">
          <div className="bg-white rounded-lg p-2 shadow">
            <QRCode id="parcel-details-qr" value={qrValue} size={96} level="M" />
          </div>
          <div className="text-[10px] text-gray-300 mt-1 max-w-[96px] break-all">
            #{qrValue}
          </div>
        </div>
      )}

      {/* push content so it doesn't overlap the QR */}
      <div className="pl-[120px]">
        <Link to="/myparcels" className="flex items-center text-[#24bfd7] mb-4 hover:underline">
          <FaArrowLeft className="mr-2" /> Back to My Parcels
        </Link>

        <h2 className="text-2xl font-semibold text-[#24bfd7] mb-6">Parcel Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <p><span className="font-medium text-gray-400">Tracking ID:</span> {parcel._id}</p>
          <p><span className="font-medium text-gray-400">Status:</span> {statusLabel}</p>
          <p><span className="font-medium text-gray-400">From:</span> {parcel.from}</p>
          <p><span className="font-medium text-gray-400">To:</span> {parcel.to}</p>
          <p><span className="font-medium text-gray-400">Sender:</span> {parcel.senderName}</p>
          <p><span className="font-medium text-gray-400">Recipient:</span> {parcel.recipientName}</p>
          <p><span className="font-medium text-gray-400">Weight:</span> {parcel.weight}Kg</p>
          <p><span className="font-medium text-gray-400">Cost:</span> {parcel.cost}</p>
          <p><span className="font-medium text-gray-400">Date:</span> {parcel.date}</p>
        </div>

        {isDeliveryAgent && (
          <div className="mt-6">
            <label className="block mb-2 text-sm text-gray-300">Update Delivery Status</label>
            <select
              className={`w-full sm:w-auto text-sm border border-[#2a2b3a] bg-[#2a2b3a] text-white rounded px-2 py-2 outline-none ${
                locked ? "opacity-60 cursor-not-allowed" : "hover:bg-[#343549]"
              }`}
              value=""
              onChange={(e) => handleAgentStatusChange(Number(e.target.value))}
              disabled={locked}
            >
              <option value="" disabled>
                {locked ? "Status is finalized" : "Set status…"}
              </option>
              <option value={3}>Delivered</option>
              <option value={5}>Returned</option>
            </select>
            {locked && (
              <p className="mt-2 text-xs text-gray-400">
                This parcel is already finalized (Delivered/Returned). Further changes are disabled.
              </p>
            )}
          </div>
        )}

        {!isDeliveryAgent && showFeedbackForm && (
          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block mb-2 text-gray-300">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full p-3 bg-[#2a2b3a] rounded-md text-white focus:ring-2 focus:ring-[#24bfd7] resize-none"
              rows="4"
            />
            <button
              type="submit"
              className="mt-4 bg-[#24bfd7] hover:bg-[#1ca5b8] px-6 py-2 rounded-md text-white transition"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ParcelDetails;
