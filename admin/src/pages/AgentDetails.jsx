import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { publicRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";

const AgentDetails = () => {
  const [agent, setAgent] = useState({});
  const [formData, setFormData] = useState({});
  const location = useLocation();

  const agentId = location.pathname.split("/")[2];

 useEffect(() => {
  const getAgent = async () => {
    try {
      const res = await publicRequest.get("/delivery-agents/" + agentId); // Use the correct agentId here
      console.log("Agent data:", res.data); // Log the response to make sure you're getting the correct data
      setAgent(res.data);  // Set the agent data
      setFormData(res.data);  // Set the form data to prefill the form
    } catch (error) {
      console.log("Error fetching agent:", error);  // Handle any errors
    }
  };
  getAgent(); // Call the function to fetch the agent
}, [agentId]);  // The effect will run when the agentId changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const isChanged = JSON.stringify(agent) !== JSON.stringify(formData);

    if (!isChanged) {
      toast.info("No changes to update");
      return;
    }

    try {
      await publicRequest.put(`/delivery-agents/${agentId}`, formData);
      toast.success("Agent details updated successfully");
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    }
  };

  return (
  <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
    <h2 className="font-semibold text-xl mb-6 text-[#2185d0]">
      Update Agent Info
    </h2>

    <div className="grid grid-cols-2 gap-6">
      {/* Full Name */}
      <div className="flex flex-col">
        <label className="mb-1">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname || ""}
          onChange={handleChange}
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label className="mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        />
      </div>

      {/* Division */}
      <div className="flex flex-col">
        <label className="mb-1">Division</label>
        <input
          type="text"
          name="division"
          value={formData.division || ""}
          onChange={handleChange}
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        />
      </div>

      {/* Feedback */}
      <div className="flex flex-col col-span-2">
        <label className="mb-1">Feedback</label>
        <textarea
          name="feedback"
          value={formData.feedback || ""}
          onChange={handleChange}
          placeholder="Feedback..."
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        ></textarea>
      </div>

      {/* Note */}
      <div className="flex flex-col col-span-2">
        <label className="mb-1">Note</label>
        <textarea
          name="note"
          value={formData.note || ""}
          onChange={handleChange}
          placeholder="Optional note..."
          className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
        ></textarea>
      </div>

    </div>

    <div className="mt-8">
      <button
        onClick={handleUpdate}
        className="bg-[#2185d0] px-6 py-2 rounded text-white hover:bg-[#1a6fb2] transition"
      >
        Update
      </button>
      <ToastContainer />
    </div>
  </div>
);

};

export default AgentDetails;
