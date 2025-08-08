import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { publicRequest } from "../requestMethods";
import { ToastContainer,toast } from "react-toastify";

const Parcel = () => {
  const [parcel, setParcel] = useState({});
  const [formData, setFormData] = useState({});
  const location = useLocation();

  const parcelId = location.pathname.split("/")[2];
  

  useEffect(() => {
    const getParcel = async () => {
      try {
        const res = await publicRequest.get("/parcels/find/" + parcelId);
        setParcel(res.data);
        setFormData(res.data); 
      } catch (error) {
        console.log(error);
      }
    };
    getParcel();
  }, [parcelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleUpdate = async () => {
  const isChanged = JSON.stringify(parcel) !== JSON.stringify(formData);

  if (!isChanged) {
    toast.info("No changes to update");
    return;
  }

  try {
    await publicRequest.put(`/parcels/${parcelId}`, formData);
    toast.success("Parcel updated successfully");
  } catch (error) {
    toast.error("Update failed");
    console.log(error);
  }
};



  return (
    <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
      <h2 className="font-semibold text-xl mb-6 text-[#2185d0]">
        Update Parcel Info
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/** From */}
        <div className="flex flex-col">
          <label className="mb-1">From</label>
          <input
            type="text"
            name="from"
            value={formData.from || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** To */}
        <div className="flex flex-col">
          <label className="mb-1">To</label>
          <input
            type="text"
            name="to"
            value={formData.to || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Sender Name */}
        <div className="flex flex-col">
          <label className="mb-1">Sender Name</label>
          <input
            type="text"
            name="senderName"
            value={formData.senderName || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Sender Email */}
        <div className="flex flex-col">
          <label className="mb-1">Sender Email</label>
          <input
            type="email"
            name="senderEmail"
            value={formData.senderEmail || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Recipient Name */}
        <div className="flex flex-col">
          <label className="mb-1">Recipient Name</label>
          <input
            type="text"
            name="recipientName"
            value={formData.recipientName || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Recipient Email */}
        <div className="flex flex-col">
          <label className="mb-1">Recipient Email</label>
          <input
            type="email"
            name="recipientEmail"
            value={formData.recipientEmail || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Weight */}
        <div className="flex flex-col">
          <label className="mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Cost */}
        <div className="flex flex-col">
          <label className="mb-1">Cost ($)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost || ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
        </div>

        {/** Note */}
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

        {/** Feedback */}
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

        {/** Date */}
        <div className="flex flex-col">
          <label className="mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date ? formData.date.slice(0, 10) : ""}
            onChange={handleChange}
            className="bg-[#3b3c4e] text-white p-2 rounded outline-none focus:ring-2 focus:ring-[#2185d0]"
          />
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

export default Parcel;
