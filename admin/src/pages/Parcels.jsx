import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethods";

const STATUS = {
  0: "None",
  1: "Pending",
  2: "Assigned to Delivery Agent",
  3: "Delivered",
  4: "Delivered & Mail sent",
  5: "Returned",
};

const STATUS_COLORS = {
  0: "bg-slate-400",   // None
  1: "bg-gray-500",    // Pending
  2: "bg-yellow-500",  // Assigned to Delivery Agent
  3: "bg-green-500",   // Delivered
  4: "bg-green-500",   // Delivered
  5: "bg-red-500",     // Returned
};

const Parcels = () => {
  const [data, setData] = useState([]);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/parcels/${id}`);
      setData((prev) => prev.filter((parcel) => parcel._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 20 },
    { field: "senderName", headerName: "Sender Name", width: 120 },
    { field: "senderEmail", headerName: "Sender Email", width: 180 },
    { field: "recipientName", headerName: "Recipient Name", width: 120 },
    { field: "recipientEmail", headerName: "Recipient Email", width: 180 },
    { field: "from", headerName: "From", width: 100 },
    { field: "to", headerName: "To", width: 100 },
    { field: "weight", headerName: "Weight (kg)", width: 80 },
    { field: "cost", headerName: "Cost ($)", width: 100 },

    // 🆕 Assigned Agent (works with either top-level fields or populated object)
    {
      field: "assignedAgent",
      headerName: "Assigned Agent",
      width: 280,
      sortable: false,
      renderCell: ({ row }) => {
        const name =
          row.assignedAgentName ??
          row.assignedAgent?.name ??
          null;
        const email =
          row.assignedAgentEmail ??
          row.assignedAgent?.email ??
          null;

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

    // Status badge with background color
    {
      field: "status",
      headerName: "Status",
      width: 260,
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
      width: 180,
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
  ];

  useEffect(() => {
    const getParcels = async () => {
      try {
        const res = await publicRequest.get("/parcels");
        // normalize status to a number so mapping always works
        const rows = (res.data ?? []).map((p) => ({
          ...p,
          status: Number(p.status ?? 0),
        }));
        setData(rows);
      } catch (error) {
        console.log(error);
      }
    };
    getParcels();
  }, []);

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
