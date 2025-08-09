import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import {  useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);

  const user = useSelector((state) => state.user);


  useEffect(() => {
    const getParcels = async () => {
      try {
        const res = await publicRequest.post("/parcels/me", {
          email: user.currentUser.email,
        });

        setParcels(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getParcels();
  }, []);

  console.log(parcels);

  const statusMap = {
    1: "Pending",
    2: "In Transit",
    3: "Delivered",
    4: "Cancelled",
    5: "Returned",
  };

  const statusColors = {
    "In Transit": "bg-yellow-500",
    Delivered: "bg-green-500",
    Pending: "bg-gray-500",
    Cancelled: "bg-red-500",
    Returned: "bg-purple-600",
  };

  return (
    <div className="min-h-screen bg-[#2f3041] px-6 py-10 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">📦 My Parcels</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {parcels.map((parcel) => (
          <div
            key={parcel.id}
            className="bg-[#1f1f2f] rounded-xl shadow-md p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div>
              <h3 className="text-xl font-semibold">
                Parcel ID: <span className="text-[#24bfd7]">{parcel._id}</span>
              </h3>
              <p className="text-sm text-gray-400">
                Sender: {parcel.senderName}
              </p>
              <p className="text-sm text-gray-400">Address: {parcel.to}</p>
              <p className="text-sm text-gray-400">
                Expected Delivery: {parcel.date}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <span
                className={`text-sm px-3 py-1 rounded-full font-semibold ${
                  statusColors[statusMap[parcel.status]]
                }`}
              >
                {statusMap[parcel.status]}
              </span>

              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-[#24bfd7] hover:bg-[#1ba6b8] rounded-md font-semibold">
                  Track
                </button>
                <Link to={`/parcel/${parcel._id}`}>
                  <button className="px-4 py-2 text-sm border border-gray-400 hover:bg-[#1f1f2f] rounded-md">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyParcels;
