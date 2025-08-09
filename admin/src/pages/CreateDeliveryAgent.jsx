import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { publicRequest } from "../requestMethods"; // Assuming publicRequest is defined

const CreateDeliveryAgent = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generatePassword = (length) => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+";

    // Ensure at least one from each category
    const getRandom = (chars) =>
      chars[Math.floor(Math.random() * chars.length)];

    const requiredChars = [
      getRandom(lower),
      getRandom(upper),
      getRandom(numbers),
      getRandom(special),
    ];

    const allChars = lower + upper + numbers + special;
    let remainingChars = "";

    for (let i = 0; i < length - requiredChars.length; i++) {
      remainingChars += getRandom(allChars);
    }

    // Combine and shuffle
    const password = [...requiredChars, ...remainingChars]
      .sort(() => Math.random() - 0.5) // Shuffle
      .join("");

    return password;
  };

  const handleCreateAgent = async () => {
    try {
      const password = generatePassword(8); // Generate password
      // Send POST request to create a new delivery agent
      await publicRequest.post("/delivery-agents", {
        ...inputs,
        password, // Send password along with other data
      });
      toast.success("Delivery Agent created successfully!");
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg || "Failed to create Delivery Agent");
    }
  };

  return (
    <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
      <h2 className="font-semibold text-xl mb-6 text-[#2185d0]">
        Create New Delivery Agent
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="mb-1">Full Name</label>
          <input
            type="text"
            name="fullname"
            onChange={handleChange}
            placeholder="Delivery Agent's full name"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Delivery Agent's email"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            placeholder="Delivery Agent's phone"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1">Division</label>
          <input
            type="text"
            name="division"
            onChange={handleChange}
            placeholder="Division"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        <div className="flex flex-col col-span-2">
          <label className="mb-1">Address</label>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            placeholder="Full address"
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8">
        <button
          onClick={handleCreateAgent}
          className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition"
        >
          Create Delivery Agent
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateDeliveryAgent;
