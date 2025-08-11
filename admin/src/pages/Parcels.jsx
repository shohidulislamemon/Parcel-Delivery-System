// src/pages/Parcels.jsx
import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// React Router v6:
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
  const joinedRoomsRef = useRef(new Set());

  // optimistic delete state
  const [deletingIds, setDeletingIds] = useState(() => new Set());
  const deletedIdsRef = useRef(new Set()); // ignore stale updates for these
  const rollbackRef = useRef(null); // snapshot to restore on failure

  const handleDelete = useCallback(async (id) => {
    const safeId = String(id).trim();
    const encodedId = encodeURIComponent(safeId);

    // mark as deleting & record as locally deleted
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(safeId);
      return next;
    });
    deletedIdsRef.current.add(safeId);

    // optimistic UI: remove immediately (keep snapshot)
    setData((prev) => {
      rollbackRef.current = prev;
      return prev.filter((p) => String(p._id) !== safeId);
    });

    try {
      await publicRequest.delete(`/parcels/${encodedId}`);
    } catch (error) {
      const status = error?.response?.status;
      const body = error?.response?.data;
      console.error("DELETE /parcels/:id failed:", { status, body, error });

      // rollback UI
      if (rollbackRef.current) {
        setData(rollbackRef.current);
        rollbackRef.current = null;
      }
      // since it failed, allow future updates again
      deletedIdsRef.current.delete(safeId);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(safeId);
        return next;
      });
    }
  }, []);

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
        valueGetter: (params) => {
          const row = params?.row;
          if (!row) return "";
          const name = row.assignedAgentName ?? row.assignedAgent?.name ?? null;
          const email =
            row.assignedAgentEmail ?? row.assignedAgent?.email ?? null;
          return name || email
            ? [name ?? "", email ? `<${email}>` : ""].filter(Boolean).join(" ")
            : "Not assigned";
        },
        renderCell: ({ row }) => {
          const name = row.assignedAgentName ?? row.assignedAgent?.name ?? null;
          const email =
            row.assignedAgentEmail ?? row.assignedAgent?.email ?? null;
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
        valueGetter: (params) => STATUS[Number(params?.row?.status)] ?? "Unknown",
        renderCell: ({ row }) => {
          const code = Number(row?.status);
          const label = STATUS[code] ?? "Unknown";
          const color = STATUS_COLORS[code] ?? "bg-zinc-400";
          return (
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}
            >
              {label}
            </span>
          );
        },
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 180,
        disableExport: true,
        renderCell: (params) => {
          const idStr = String(params.row._id);
          const isDeleting = deletingIds.has(idStr);
          return (
            <div className="flex gap-2">
              <Link
                to={`/parcel/${params.row._id}`}
                className="w-[70px] bg-[#2596be] text-white text-sm px-3 py-1 rounded hover:bg-[#1d7ea1] transition duration-200 disabled:opacity-50"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button
                className={`w-[70px] text-white text-sm px-3 py-1 rounded transition duration-200 ${
                  isDeleting
                    ? "bg-[#c0c0c0] cursor-not-allowed"
                    : "bg-[#e74c3c] hover:bg-[#c0392b]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDeleting) handleDelete(params.row._id);
                }}
                disabled={isDeleting}
                title={isDeleting ? "Deleting…" : "Delete"}
              >
                {isDeleting ? "…" : "Delete"}
              </button>
            </div>
          );
        },
      },
    ],
    [deletingIds, handleDelete]
  );

  // 1) initial fetch
  useEffect(() => {
    (async () => {
      try {
        const res = await publicRequest.get("/parcels");
        const rows = (res.data ?? []).map((p) => ({
          ...p,
          _id: String(p._id),
          status: Number(p.status ?? 0),
        }));
        setData(rows);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // 2) register admin
  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("register", { email: "admin@excelbd.com", role: "admin" });
  }, []);

  // 3) live updates (don’t resurrect deleted rows)
  useEffect(() => {
    const onUpdated = (p) => {
      const pid = String(p._id);
      if (deletedIdsRef.current.has(pid)) return;

      setData((prev) => {
        const idx = prev.findIndex((x) => String(x._id) === pid);
        if (idx === -1) return prev; // don't re-add unknown rows
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          ...p,
          _id: pid,
          status: Number(p.status ?? copy[idx].status ?? 0),
        };
        return copy;
      });
    };

    const onDeleted = (p) => {
      const pid = String(p._id);
      deletedIdsRef.current.delete(pid);
      setData((prev) => prev.filter((x) => String(x._id) !== pid));
    };

    socket.on("parcel:updated", onUpdated);
    socket.on("parcel:deleted", onDeleted);
    return () => {
      socket.off("parcel:updated", onUpdated);
      socket.off("parcel:deleted", onDeleted);
    };
  }, []);

  // 4) join/leave parcel rooms (fallback)
  useEffect(() => {
    const want = new Set(data.map((r) => String(r._id)));
    want.forEach((id) => {
      if (!joinedRoomsRef.current.has(id)) {
        if (socket.connected) socket.emit("joinParcel", id);
        else socket.once("connect", () => socket.emit("joinParcel", id));
        joinedRoomsRef.current.add(id);
      }
    });
    joinedRoomsRef.current.forEach((id) => {
      if (!want.has(id)) {
        if (socket.connected) socket.emit("leaveParcel", id);
        joinedRoomsRef.current.delete(id);
      }
    });
    return () => {
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
        autoHeight
        showToolbar
        // Configure the built-in v8 toolbar (no deprecated GridToolbar).
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: "parcels",
              utf8WithBom: true,
              allColumns: true,
            },
            printOptions: {
              hideFooter: true,
              hideToolbar: true,
            },
          },
        }}
      />
    </div>
  );
};

export default Parcels;
