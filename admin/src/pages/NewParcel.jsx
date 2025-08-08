import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import { publicRequest } from "../requestMethods";

const NewParcel = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs ( (prev) => {
      return { ...prev, [e.target.name]: e.target.value };
      
    });
  };

  const handleAddParcel= async()=>{
   try {
    await publicRequest.post("/parcels",inputs)
    toast.success("Parcel has been added")
   } catch (error) {
    console.log(error)
   }

  }

  return (
    <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
      <h2 className="font-semibold text-xl mb-6 text-[#2185d0]">
        Create New Parcel
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-1">From</label>
          <input
            type="text"
            name="from"
            onChange={handleChange}
            placeholder="Merchant address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">To</label>
          <input
            type="text"
            name="to"
            onChange={handleChange}
            placeholder="Delivery address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Sender Name</label>
          <input
            type="text"
            name="senderName"
            onChange={handleChange}
            placeholder="Sender's name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Sender Email</label>
          <input
            type="email"
            name="senderEmail"
            onChange={handleChange}
            placeholder="Sender's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            onChange={handleChange}
            placeholder="Recipient's name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Recipient Email</label>
          <input
            type="email"
            name="recipientEmail"
            onChange={handleChange}
            placeholder="Recipient's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            onChange={handleChange}
            placeholder="Weight"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Cost ($)</label>
          <input
            type="number"
            name="cost"
            onChange={handleChange}
            placeholder="Cost"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Note</label>
          <textarea
            name="note"
            onChange={handleChange}
            placeholder="Optional note..."
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          ></textarea>
        </div>
       

        <div className="flex flex-col">
          <label className="mb-1">Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition" onClick={handleAddParcel}>
          Submit Parcel
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NewParcel;
