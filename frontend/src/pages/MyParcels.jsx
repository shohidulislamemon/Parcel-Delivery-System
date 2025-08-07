import React from "react";
import { Link } from 'react-router';



const MyParcels = () => {

  const parcels = [
  {
    id: "XL123456",
    recipient: "John Doe",
    address: "123 Main St, Dhaka",
    status: "In Transit",
    expectedDelivery: "Aug 12, 2025",
  },
  {
    id: "XL654321",
    recipient: "Jane Smith",
    address: "456 Second Ave, Chattogram",
    status: "Delivered",
    expectedDelivery: "Aug 5, 2025",
  },
  {
    id: "XL998877",
    recipient: "Arafat Rahman",
    address: "77 Lake View Rd, Sylhet",
    status: "Returned",
    expectedDelivery: "Aug 6, 2025",
  },
  {
    id: "XL667788",
    recipient: "Mila Khan",
    address: "33 Green Rd, Rajshahi",
    status: "Returned",
    expectedDelivery: "Aug 7, 2025",
  },
  {
    id: "XL111222",
    recipient: "Fahim Morshed",
    address: "22 College St, Barisal",
    status: "Pending",
    expectedDelivery: "Aug 15, 2025",
  },
];

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
                Parcel ID: <span className="text-[#24bfd7]">{parcel.id}</span>
              </h3>
              <p className="text-sm text-gray-400">Sender: {parcel.recipient}</p>
              <p className="text-sm text-gray-400">Address: {parcel.address}</p>
              <p className="text-sm text-gray-400">Expected Delivery: {parcel.expectedDelivery}</p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <span
                className={`text-sm px-3 py-1 rounded-full font-semibold ${statusColors[parcel.status]}`}
              >
                {parcel.status}
              </span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-[#24bfd7] hover:bg-[#1ba6b8] rounded-md font-semibold">
                  Track
                </button>
                <Link to="/parcel/123">
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

export default MyParcels