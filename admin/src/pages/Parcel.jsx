import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  0: "bg-slate-500",
  1: "bg-gray-500",
  2: "bg-yellow-500",
  3: "bg-green-600",
  4: "bg-green-600",
  5: "bg-red-600",
};

// Fallback: make a readable name from an email address
const emailToName = (email) => {
  if (!email) return "";
  const local = String(email).split("@")[0];
  return local
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const Parcel = () => {
  const [parcel, setParcel] = useState({});
  const [formData, setFormData] = useState({});
  const [savingStatus, setSavingStatus] = useState(false);

  // agents
  const [agents, setAgents] = useState([]);
  const [savingAssign, setSavingAssign] = useState(false);
  const [selectedAgentEmail, setSelectedAgentEmail] = useState("");

  const location = useLocation();
  const parcelId = location.pathname.split("/")[2];

  // Load parcel
  useEffect(() => {
    const getParcel = async () => {
      try {
        const res = await publicRequest.get(`/parcels/find/${parcelId}`);
        setParcel(res.data);
        setFormData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (parcelId) getParcel();
  }, [parcelId]);

  // Load delivery agents
  useEffect(() => {
    const getAgents = async () => {
      try {
        const res = await publicRequest.get("/delivery-agents");
        const list = (res.data || []).map((a) => ({
          ...a,
          name: a.name || emailToName(a.email),
          email: String(a.email || "").toLowerCase().trim(),
        }));
        setAgents(list);
      } catch (error) {
        console.log(error);
      }
    };
    getAgents();
  }, []);

  // Preselect assigned agent by email if present
  useEffect(() => {
    const email =
      (formData.assignedAgentEmail || parcel.assignedAgentEmail || "").toLowerCase().trim();
    if (email) setSelectedAgentEmail(email);
  }, [formData.assignedAgentEmail, parcel.assignedAgentEmail]);

  // Join specific parcel room and listen for updates (also rejoin on reconnect)
  useEffect(() => {
    if (!parcelId) return;

    const pid = String(parcelId);
    const join = () => socket.emit("joinParcel", pid);
    const leave = () => socket.emit("leaveParcel", pid);

    if (socket.connected) join();
    else socket.on("connect", join);

    const onUpdated = (p) => {
      if (String(p._id) !== pid) return;
      setParcel((prev) => ({ ...prev, ...p }));
      setFormData((prev) => ({ ...prev, ...p }));
    };
    const onDeleted = (p) => {
      if (String(p._id) !== pid) return;
      toast.warn("This parcel was deleted.");
    };

    socket.on("parcel:updated", onUpdated);
    socket.on("parcel:deleted", onDeleted);

    return () => {
      socket.off("connect", join);
      socket.off("parcel:updated", onUpdated);
      socket.off("parcel:deleted", onDeleted);
      if (socket.connected) leave();
    };
  }, [parcelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Only action from dropdown is to set Pending (1) and clear assignment
  const handleStatusChange = async (nextCode) => {
    const next = Number(nextCode);
    if (next !== 1) return;

    const prev = Number(formData.status ?? parcel.status ?? 0);
    if (next === prev && !(formData.assignedAgentEmail || parcel.assignedAgentEmail)) return;

    setSavingStatus(true);

    const payload = {
      status: 1,
      assignedAgentName: null,
      assignedAgentEmail: null,
      assignedAt: null,
    };

    // optimistic UI
    const prevSnapshot = {
      status: formData.status,
      assignedAgentName: formData.assignedAgentName,
      assignedAgentEmail: formData.assignedAgentEmail,
      assignedAt: formData.assignedAt,
    };
    setFormData((p) => ({ ...p, ...payload }));
    setSelectedAgentEmail("");

    try {
      await publicRequest.put(`/parcels/${parcelId}`, payload);
      setParcel((p) => ({ ...p, ...payload }));
      toast.success("Status set to Pending and agent unassigned");
    } catch (err) {
      console.error(err);
      // rollback
      setFormData((p) => ({ ...p, ...prevSnapshot }));
      setSelectedAgentEmail(prevSnapshot.assignedAgentEmail || "");
      toast.error("Failed to set Pending");
    } finally {
      setSavingStatus(false);
    }
  };

  // Assign delivery agent by email → set name+email and status=2
  const handleAssignAgent = async (agentEmail) => {
    const email = String(agentEmail || "").toLowerCase().trim();

    // ignore placeholder/empty choice
    if (!email) {
      setSelectedAgentEmail("");
      return;
    }

    // no-op if already assigned to this agent and status is 2
    const alreadyAssigned =
      (formData.assignedAgentEmail || parcel.assignedAgentEmail || "")
        .toLowerCase()
        .trim() === email &&
      Number(formData.status ?? parcel.status ?? 0) === 2;
    if (alreadyAssigned) return;

    setSelectedAgentEmail(email);

    const agent = agents.find((a) => a.email === email);
    const derivedName = agent?.name || emailToName(email);

    const payload = {
      assignedAgentName: derivedName,
      assignedAgentEmail: email,
      status: 2, // Assigned to Delivery Agent
    };

    // optimistic UI
    setSavingAssign(true);
    const prev = {
      assignedAgentName: formData.assignedAgentName,
      assignedAgentEmail: formData.assignedAgentEmail,
      status: formData.status,
    };
    setFormData((p) => ({ ...p, ...payload }));

    try {
      await publicRequest.put(`/parcels/${parcelId}`, payload);
      setParcel((p) => ({ ...p, ...payload }));
      toast.success("Agent assigned and status set to Assigned");
    } catch (err) {
      console.error(err);
      // rollback
      setFormData((p) => ({
        ...p,
        assignedAgentName: prev.assignedAgentName,
        assignedAgentEmail: prev.assignedAgentEmail,
        status: prev.status,
      }));
      setSelectedAgentEmail(prev.assignedAgentEmail || "");
      toast.error("Failed to assign agent");
    } finally {
      setSavingAssign(false);
    }
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
      setParcel(formData);
    } catch (error) {
      toast.error("Update failed");
      console.log(error);
    }
  };

  const statusCode = Number(formData.status ?? parcel.status ?? 0);
  const statusLabel = STATUS[statusCode] ?? "Unknown";
  const statusColor = STATUS_COLORS[statusCode] ?? "bg-zinc-600";

  const currentAgentName =
    formData.assignedAgentName ||
    parcel.assignedAgentName ||
    emailToName(formData.assignedAgentEmail || parcel.assignedAgentEmail);

  const currentAgentEmail =
    formData.assignedAgentEmail || parcel.assignedAgentEmail || "";

  return (
    <div className="m-[30px] bg-[#2f3041] p-[30px] rounded-xl shadow-lg text-white">
      <h2 className="font-semibold text-xl mb-4 text-[#2185d0]">
        Update Parcel Info
      </h2>

      {/* Status badge + dropdown */}
      <div className="mb-2 flex items-center gap-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {statusLabel}
        </span>

        <select
          className="text-sm border border-[#3b3c4e] bg-[#3b3c4e] text-white rounded px-2 py-1 outline-none hover:bg-[#45465a] disabled:opacity-60"
          value=""
          onChange={(e) => handleStatusChange(Number(e.target.value))}
          disabled={savingStatus}
        >
          <option value="" disabled>
            Set Pending…
          </option>
          <option value={1}>Pending</option>
        </select>

        {savingStatus && <span className="text-xs text-gray-300">Saving…</span>}
      </div>

      {/* Assign Delivery Agent */}
      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-300">
          Assign Delivery Agent
        </label>
        <div className="flex items-center gap-3">
          <select
            className="text-sm border border-[#3b3c4e] bg-[#3b3c4e] text-white rounded px-2 py-1 outline-none hover:bg-[#45465a] disabled:opacity-60"
            value={selectedAgentEmail}
            onChange={(e) => handleAssignAgent(e.target.value)}
            disabled={savingAssign || agents.length === 0}
          >
            <option value="">
              {agents.length ? "Select agent…" : "Loading agents…"}
            </option>
            {agents.map((a) => (
              <option key={a.email} value={a.email}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Show current assignment */}
          <div className="text-xs text-gray-300">
            {currentAgentEmail ? (
              <>
                <span className="font-medium">{currentAgentName || "—"}</span>{" "}
                (<span className="underline">{currentAgentEmail}</span>)
              </>
            ) : (
              <span>Not assigned</span>
            )}
          </div>

          {savingAssign && (
            <span className="text-xs text-gray-300">Saving…</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* From */}
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

        {/* To */}
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

        {/* Sender Name */}
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

        {/* Sender Email */}
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

        {/* Recipient Name */}
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

        {/* Recipient Email */}
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

        {/* Weight */}
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

        {/* Cost */}
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

        {/* Note (read-only) */}
        <div className="flex flex-col col-span-2">
          <label className="mb-1">Note</label>
          <div className="bg-[#3b3c4e] text-white p-2 rounded min-h-[80px] whitespace-pre-wrap">
            {formData.note || "—"}
          </div>
        </div>

        {/* Feedback (read-only) */}
        <div className="flex flex-col col-span-2">
          <label className="mb-1">Feedback</label>
          <div className="bg-[#3b3c4e] text-white p-2 rounded min-h-[80px] whitespace-pre-wrap">
            {formData.feedback || "—"}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date ? String(formData.date).slice(0, 10) : ""}
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
