import React from "react";

const NewParcel = () => {
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
            placeholder="Merchant address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">To</label>
          <input
            type="text"
            placeholder="Delivery address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Sender Name</label>
          <input
            type="text"
            placeholder="Sender's name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Sender Email</label>
          <input
            type="email"
            placeholder="Sender's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Recipient Name</label>
          <input
            type="text"
            placeholder="Recipient's name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Recipient Email</label>
          <input
            type="email"
            placeholder="Recipient's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Weight (kg)</label>
          <input
            type="number"
            placeholder="Weight"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Cost ($)</label>
          <input
            type="number"
            placeholder="Cost"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Note</label>
          <textarea
            placeholder="Optional note..."
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          ></textarea>
        </div>
        <div className="flex flex-col col-span-2">
          <label className="mb-1">Feedback</label>
          <textarea
            placeholder="Feedback..."
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Date</label>
          <input
            type="date"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition">
          Submit Parcel
        </button>
      </div>
    </div>
  );
};

export default NewParcel;
