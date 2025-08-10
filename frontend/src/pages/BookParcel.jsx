import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { publicRequest } from "../requestMethods";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// fallback: make a readable name from an email address
const nameFromEmail = (email) => {
  if (!email) return "";
  const local = String(email).split("@")[0];
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const BookParcel = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.user.currentUser) || {};

  // derive user-bound fields (non-editable)
  const senderEmail = useMemo(
    () => String(currentUser?.email || "").trim(),
    [currentUser?.email]
  );
  const senderName = useMemo(() => {
    const n = String(currentUser?.name || currentUser?.fullName || "").trim();
    return n || nameFromEmail(senderEmail);
  }, [currentUser?.name, currentUser?.fullName, senderEmail]);

  // prefill "from" from user address but allow editing
  const initialFrom = useMemo(
    () =>
      String(
        currentUser?.address ||
          currentUser?.addressLine ||
          currentUser?.street ||
          ""
      ).trim(),
    [currentUser?.address, currentUser?.addressLine, currentUser?.street]
  );

  const [inputs, setInputs] = useState({
    from: initialFrom,  // editable
    to: "",
    recipientName: "",
    recipientEmail: "",
    weight: "",
    cost: "",
    note: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // keep "from" in sync if user object arrives later (e.g., after async auth restore)
  useEffect(() => {
    setInputs((prev) => ({ ...prev, from: prev.from || initialFrom }));
  }, [initialFrom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    // minimal checks; adjust as you like
    if (!senderEmail) return "You must be logged in with a valid email.";
    if (!senderName) return "Your profile is missing a name.";
    if (!inputs.from?.trim()) return `"From" (pickup address) is required.`;
    if (!inputs.to?.trim()) return `"To" (delivery address) is required.`;
    if (!inputs.recipientName?.trim()) return "Recipient name is required.";
    if (!inputs.recipientEmail?.trim()) return "Recipient email is required.";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(inputs.recipientEmail.trim()))
      return "Recipient email is invalid.";
    if (inputs.weight === "" || Number(inputs.weight) <= 0)
      return "Weight must be a positive number.";
    if (inputs.cost === "" || Number(inputs.cost) < 0)
      return "Cost must be zero or more.";
    // date optional; backend can default if needed
    return null;
    // you can also enforce a specific date format if required
  };

  const handleBookParcel = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const payload = {
      // user-controlled fields
      from: inputs.from.trim(),
      to: inputs.to.trim(),
      recipientName: inputs.recipientName.trim(),
      recipientEmail: inputs.recipientEmail.trim().toLowerCase(),
      weight: Number(inputs.weight),
      cost: Number(inputs.cost),
      note: inputs.note?.trim() || "",
      date: inputs.date || null,

      // server-trusted fields (non-editable in UI)
      senderName: senderName,
      senderEmail: senderEmail.toLowerCase(),
      status: 0, // Pending by default
    };

    setSubmitting(true);
    try {
      await publicRequest.post("/parcels", payload);
      toast.success("Parcel has been booked successfully!");
      // give toast a moment, then navigate
      setTimeout(() => navigate("/myparcels"), 300);
    } catch (error) {
      console.log(error);
      toast.error("Failed to book the parcel. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[90%] sm:w-[60%] md:w-[55%] mt-10 mx-auto bg-[#1f1f2f] text-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-[#24bfd7] mb-6">
        Book a New Parcel
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
        {/* From (prefilled from user address, but editable) */}
        <div className="flex flex-col">
          <label className="mb-1">From</label>
          <input
            type="text"
            name="from"
            value={inputs.from}
            onChange={handleChange}
            placeholder="Pickup address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">To</label>
          <input
            type="text"
            name="to"
            value={inputs.to}
            onChange={handleChange}
            placeholder="Delivery address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        {/* Sender Name (from user, read-only) */}
        <div className="flex flex-col">
          <label className="mb-1">Sender Name</label>
          <input
            type="text"
            value={senderName}
            readOnly
            disabled
            className="bg-[#2b2c3a] text-white p-2 rounded outline-none opacity-80"
          />
          
        </div>

        {/* Sender Email (from user, read-only) */}
        <div className="flex flex-col">
          <label className="mb-1">Sender Email</label>
          <input
            type="email"
            value={senderEmail}
            readOnly
            disabled
            className="bg-[#2b2c3a] text-white p-2 rounded outline-none opacity-80"
          />
          
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={inputs.recipientName}
            onChange={handleChange}
            placeholder="Recipient's name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Recipient Email</label>
          <input
            type="email"
            name="recipientEmail"
            value={inputs.recipientEmail}
            onChange={handleChange}
            placeholder="Recipient's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Weight (kg)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="weight"
            value={inputs.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Cost ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="cost"
            value={inputs.cost}
            onChange={handleChange}
            placeholder="Cost"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
            required
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Note</label>
          <textarea
            name="note"
            value={inputs.note}
            onChange={handleChange}
            placeholder="Optional note..."
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0] min-h-[90px]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={inputs.date}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition disabled:opacity-60"
          onClick={handleBookParcel}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Parcel"}
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BookParcel;
