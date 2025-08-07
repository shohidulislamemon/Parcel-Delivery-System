import React from "react";

const NewUser = () => {
  return (
    <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
      <h2 className="font-semibold text-xl mb-6 text-[#2185d0]">
        Create New User
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-1">Full Name</label>
          <input
            type="text"
            placeholder="User's full name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Email</label>
          <input
            type="email"
            placeholder="User's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Age</label>
          <input
            type="number"
            placeholder="User's age"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Division</label>
          <input
            type="text"
            placeholder="Division"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Address</label>
          <input
            type="text"
            placeholder="Full address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Password</label>
          <input
            type="password"
            placeholder="Set password"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <button className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition">
          Create User
        </button>
      </div>
    </div>
  );
};

export default NewUser;
