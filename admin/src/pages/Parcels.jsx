// src/pages/Parcels.jsx
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import { socket } from "../socket";

const STATUS = {
  0: "None",
  1: "Pending",
  2: "Assigned to Delivery Agent",
  3: "Delivered",
  4: "Delivered & Mail sent",
  5: "Returned",
};

const STATUS_COLORS = {
  0: "bg-slate-400",
  1: "bg-gray-500",
  2: "bg-yellow-500",
  3: "bg-green-500",
  4: "bg-green-500",
  5: "bg-red-500",
};

const Parcels = () => {
  const [data, setData] = useState([]);
  const joinedRoomsRef = useRef(new Set()); // track parcel rooms we joined (fallback)

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/parcels/${id}`);
      setData((prev) => prev.filter((parcel) => parcel._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      { field: "_id", headerName: "ID", width: 220 },
      { field: "senderName", headerName: "Sender Name", width: 150 },
      { field: "senderEmail", headerName: "Sender Email", width: 180 },
      { field: "recipientName", headerName: "Recipient Name", width: 150 },
      { field: "recipientEmail", headerName: "Recipient Email", width: 180 },
      { field: "from", headerName: "From", width: 100 },
      { field: "to", headerName: "To", width: 100 },
      { field: "weight", headerName: "Weight (kg)", width: 100 },
      { field: "cost", headerName: "Cost ($)", width: 100 },
      {
        field: "assignedAgent",
        headerName: "Assigned Agent",
        width: 260,
        sortable: false,
        renderCell: ({ row }) => {
          const name = row.assignedAgentName ?? row.assignedAgent?.name ?? null;
          const email = row.assignedAgentEmail ?? row.assignedAgent?.email ?? null;
          if (!name && !email) {
            return (
              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-zinc-200 text-zinc-700">
                Not assigned
              </span>
            );
          }
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{name ?? "—"}</span>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="text-xs text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {email}
                </a>
              ) : (
                <span className="text-xs text-gray-500">—</span>
              )}
            </div>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 220,
        renderCell: ({ row }) => {
          const code = Number(row?.status);
          const label = STATUS[code] ?? "Unknown";
          const color = STATUS_COLORS[code] ?? "bg-zinc-400";
          return (
            <span className={`inline-block px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}>
              {label}
            </span>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 160,
        renderCell: (params) => (
          <div className="flex gap-2">
            <Link to={`/parcel/${params.row._id}`}>
              <button className="w-[70px] bg-[#2596be] text-white text-sm px-3 py-1 rounded hover:bg-[#1d7ea1] transition duration-200">
                Edit
              </button>
            </Link>
            <button
              className="w-[70px] bg-[#e74c3c] text-white text-sm px-3 py-1 rounded hover:bg-[#c0392b] transition duration-200"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // 1) initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await publicRequest.get("/parcels");
        const rows = (res.data ?? []).map((p) => ({
          ...p,
          _id: String(p._id),           // normalize
          status: Number(p.status ?? 0) // normalize
        }));
        setData(rows);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // 2) ensure we are registered as admin (so server can io.to("admins").emit() to us)
  useEffect(() => {
    if (!socket.connected) socket.connect();
    // Use any admin email string; server requires a non-empty email to register.
    socket.emit("register", { email: "admin@excelbd.com", role: "admin" });
  }, []);

  // 3) live updates via admin broadcast
  useEffect(() => {
    const onUpdated = (p) => {
      const pid = String(p._id);
      setData((prev) => {
        const idx = prev.findIndex((x) => String(x._id) === pid);
        if (idx === -1) {
          // Optional: append if a new parcel appears
          return [...prev, { ...p, _id: pid, status: Number(p.status ?? 0) }];
        }
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...p, _id: pid, status: Number(p.status ?? copy[idx].status ?? 0) };
        return copy;
      });
    };

    const onDeleted = (p) => {
      const pid = String(p._id);
      setData((prev) => prev.filter((x) => String(x._id) !== pid));
    };

    socket.on("parcel:updated", onUpdated);
    socket.on("parcel:deleted", onDeleted);

    return () => {
      socket.off("parcel:updated", onUpdated);
      socket.off("parcel:deleted", onDeleted);
    };
  }, []);

  // 4) fallback: also join rooms for all visible parcels (works even if admin broadcast is missing)
  useEffect(() => {
    const want = new Set(data.map((r) => String(r._id)));
    // join newly needed rooms
    want.forEach((id) => {
      if (!joinedRoomsRef.current.has(id)) {
        if (socket.connected) socket.emit("joinParcel", id);
        else socket.once("connect", () => socket.emit("joinParcel", id));
        joinedRoomsRef.current.add(id);
      }
    });
    // leave rooms no longer shown
    joinedRoomsRef.current.forEach((id) => {
      if (!want.has(id)) {
        if (socket.connected) socket.emit("leaveParcel", id);
        joinedRoomsRef.current.delete(id);
      }
    });

    return () => {
      // on unmount, leave all joined rooms
      joinedRoomsRef.current.forEach((id) => {
        if (socket.connected) socket.emit("leaveParcel", id);
      });
      joinedRoomsRef.current.clear();
    };
  }, [data]);

  return (
    <div className="m-[30] bg-[#fff] p-[20px]">
      <div className="flex items-center justify-between">
        <h1 className="m-[20px] text-[20px] text-[#24bfd7]">All Parcels</h1>
        <Link to="/newparcel">
          <button className="bg-[#26a0ab] text-[#fff] p-[10px] cursor-pointer ">
            New Parcel
          </button>
        </Link>
      </div>
      <DataGrid
        rows={data}
        getRowId={(row) => row._id}
        columns={columns}
        checkboxSelection
      />
    </div>
  );
};

export default Parcels;
