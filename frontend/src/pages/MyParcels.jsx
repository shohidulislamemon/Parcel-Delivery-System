import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";

const statusMap = {
  0: "Pending",
  1: "Pending",
  2: "Assigned",
  3: "Delivered",
  4: "Delivered", // keep if backend uses 5 for Returned; otherwise set 4: "Returned"
  5: "Returned",
};

const statusColors = {
  Assigned: "bg-yellow-500",
  Delivered: "bg-green-500",
  Pending: "bg-gray-500",
  Returned: "bg-red-500",
};

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);
  const user = useSelector((state) => state.user);

  const current = user?.currentUser || {};
  const email = current?.email || "";
  const role = (current?.role || "").toLowerCase();
  const isDeliveryAgent =
    current?.isDeliveryAgent === true ||
    role === "delivery-agent" ||
    role === "agent";

  useEffect(() => {
    const getParcels = async () => {
      if (!email) return;

      try {
        const endpoint = isDeliveryAgent ? "/delivery-agents/me" : "/parcels/me";
        const res = await publicRequest.post(endpoint, { email });
        const rows = (res.data ?? []).map((p) => ({
          ...p,
          status: Number(p.status ?? 0),
        }));
        setParcels(rows);
      } catch (error) {
        console.log(error);
      }
    };

    getParcels();
  }, [email, isDeliveryAgent]);

  return (
    <div className="min-h-screen bg-[#2f3041] px-6 py-10 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">📦 My Parcels</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {parcels.map((parcel) => {
          const code = Number(parcel.status);
          const label = statusMap[code] || "Pending";
          const badge = statusColors[label] || "bg-gray-500";

          return (
            <div
              key={parcel._id}
              className="bg-[#1f1f2f] rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  Parcel ID: <span className="text-[#24bfd7]">{parcel._id}</span>
                </h3>
                <p className="text-sm text-gray-400">Sender: {parcel.senderName}</p>
                <p className="text-sm text-gray-400">Address: {parcel.to}</p>
                <p className="text-sm text-gray-400">
                  Expected Delivery: {parcel.date}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-3">
                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${badge}`}>
                  {label}
                </span>

                <div className="flex gap-2">
                  {!isDeliveryAgent && (
                    <button className="px-4 py-2 text-sm bg-[#24bfd7] hover:bg-[#1ba6b8] rounded-md font-semibold">
                      Track
                    </button>
                  )}
                  <Link to={`/parcel/${parcel._id}`}>
                    <button className="px-4 py-2 text-sm border border-gray-400 hover:bg-[#1f1f2f] rounded-md">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyParcels;
