import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";
import { socket } from "../socket";

const statusMap = {
  0: "Pending",
  1: "Pending",
  2: "Assigned",
  3: "Delivered",
  4: "Delivered",
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
  const current = useSelector((s) => s.user.currentUser) || {};

  const email = (current.email || "").toLowerCase().trim();
  const isDeliveryAgent =
    current?.isDeliveryAgent === true ||
    /delivery-agent|agent/i.test(current?.role || "");

  // 🔑 ensure socket is connected & registered to the right room(s)
  useEffect(() => {
    if (!email) return;

    const role = isDeliveryAgent ? "delivery-agent" : "user";

    const doRegister = () => {
      if (!socket.connected) socket.connect();
      socket.emit("register", { email, role });
      // console.log("[socket] registered", { email, role });
    };

    doRegister();
    // re-register on reconnects (e.g., network hiccups)
    socket.on("connect", doRegister);

    return () => {
      socket.off("connect", doRegister);
    };
  }, [email, isDeliveryAgent]);

  // Initial fetch
  useEffect(() => {
    const getParcels = async () => {
      if (!email) return;
      try {
        const endpoint = isDeliveryAgent ? "/delivery-agents/me" : "/parcels/me";
        const res = await publicRequest.post(endpoint, { email });
        const rows = (res.data ?? []).map((p) => ({
          ...p,
          _id: String(p._id),
          status: Number(p.status ?? 0),
          senderEmail: (p.senderEmail || "").toLowerCase(),
          assignedAgentEmail: (p.assignedAgentEmail || "").toLowerCase(),
        }));
        setParcels(rows);
      } catch (error) {
        console.log(error);
      }
    };
    getParcels();
  }, [email, isDeliveryAgent]);

  // Live updates (after registration above)
  useEffect(() => {
    if (!email) return;

    const shouldShow = (parcel) => {
      const pSender = (parcel.senderEmail || "").toLowerCase();
      const pAgent = (parcel.assignedAgentEmail || "").toLowerCase();
      return isDeliveryAgent ? pAgent === email : pSender === email;
    };

    const onUpdated = (p) => {
      const payload = {
        ...p,
        _id: String(p._id),
        status: Number(p.status ?? 0),
        senderEmail: (p.senderEmail || "").toLowerCase(),
        assignedAgentEmail: (p.assignedAgentEmail || "").toLowerCase(),
      };

      setParcels((prev) => {
        const idx = prev.findIndex((x) => x._id === payload._id);

        if (shouldShow(payload)) {
          if (idx === -1) return [...prev, payload];      // new to this user/agent
          const copy = [...prev];                          // update existing
          copy[idx] = { ...copy[idx], ...payload };
          return copy;
        }

        // if reassigned away, remove from this list
        if (idx !== -1) return prev.filter((x) => x._id !== payload._id);
        return prev;
      });
    };

    const onDeleted = (p) => {
      const pid = String(p._id);
      setParcels((prev) => prev.filter((x) => x._id !== pid));
    };

    socket.on("parcel:updated", onUpdated);
    socket.on("parcel:deleted", onDeleted);
    return () => {
      socket.off("parcel:updated", onUpdated);
      socket.off("parcel:deleted", onDeleted);
    };
  }, [email, isDeliveryAgent]);

  return (
    <div className="min-h-screen bg-[#2f3041] px-6 py-10 text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">📦 My Parcels</h2>

      <div className="space-y-6 max-w-4xl mx-auto">
        {parcels.map((parcel) => {
          const label = statusMap[Number(parcel.status)] || "Pending";
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
        {parcels.length === 0 && (
          <div className="text-center text-gray-400">No parcels yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;
