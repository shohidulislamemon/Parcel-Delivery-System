import React, { useEffect, useState } from "react";
import { HiArrowSmallUp, HiArrowLongDown } from "react-icons/hi2";
import { PieChart } from "@mui/x-charts/PieChart";
import { publicRequest } from "../requestMethods";

const Home = () => {
  const [parcels, setParcels] = useState([]);
  const [users, setUsers] = useState([]);

  const isToday = (raw) => {
    if (!raw) return false;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return false;
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const todayParcels = parcels.filter((p) =>
    isToday(p?.date ?? p?.updatedAt ?? p?.createdAt)
  );

  const usersCount = users.length;

  const deliveredCount = todayParcels.filter((p) => Number(p.status) === 4).length;
  const pendingCount = todayParcels.filter((p) => Number(p.status) === 1).length;
  const assignToAgent = todayParcels.filter((p) => Number(p.status) === 2).length;
  const returnCount = todayParcels.filter((p) => Number(p.status) === 5).length; 

  const deliveredToday = todayParcels.filter((p) =>
    [3, 4].includes(Number(p.status))
  );

  const capWords = (s) =>
    s
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const fallbackNameFromEmail = (email) => {
    if (!email) return "Unknown";
    const local = String(email).split("@")[0];
    return capWords(local.replace(/[._-]+/g, " "));
  };

  const agentMap = new Map();
  for (const p of deliveredToday) {
    const email = String(p.assignedAgentEmail || "").toLowerCase().trim();
    const name = p.assignedAgentName || fallbackNameFromEmail(email);
    const key = email || name; 
    const entry = agentMap.get(key) || { name, email, count: 0 };
    entry.count += 1;
    if (!entry.name && name) entry.name = name;
    agentMap.set(key, entry);
  }

  const topAgents = Array.from(agentMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  useEffect(() => {
    const getParcels = async () => {
      try {
        const res = await publicRequest.get("/parcels");
        setParcels(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getParcels();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await publicRequest.get("/users");
        setUsers(res.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center ">
        <div className="flex flex-col text-[#24bfd7] h-[250px] w-[350px] shadow-xl m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold ">Users</h1>
            <div className="flex items-center mt-[20px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">{usersCount}</span>
          </div>
        </div>
        <div className="flex flex-col text-[#24bfd7] h-[250px] w-[350px] shadow-xl m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold ">Delivered Parcel</h1>
            <div className="flex items-center mt-[20px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">{deliveredCount}</span>
          </div>
        </div>

        <div className="flex flex-col text-[#24bfd7] h-[250px] w-[350px] shadow-xl m-[20px]">
          <div className="flex flex-col items-center justify-center mt-[10%]">
            <h1 className="text-[20px] font-semibold ">Pending Parcel</h1>
            <div className="flex items-center mt-[20px]">
              <HiArrowSmallUp className="text-[28px] text-green-500" />
              <HiArrowLongDown className="text-[28px] text-red-500" />
            </div>
            <span className="mt-[20px] text-[18px]">{pendingCount}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-[450px] w-[500px] text-[#fff]">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: pendingCount, label: "Pending " },
                  { id: 1, value: assignToAgent, label: "Assigned to Delivery Agent" },
                  { id: 2, value: deliveredCount, label: "Delivered " },
                  { id: 4, value: returnCount, label: "Returned" },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 150,
                cy: 150,
                labelStyle: {
                  fill: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                },
              },
            ]}
          />
        </div>
        <div className="h-[300px] w-[300px] shadow-lg p-[20px] ">
          <h2 className="flex px-[20px] text-[#24bfd7]">Top Delivery Agents</h2>
          <ol className="flex font-semibold flex-col justify-end px-[20px] mt-[10px] text-[#24bfd7]">
            {topAgents.length ? (
              topAgents.map((a, i) => (
                <li key={a.email || a.name}>
                  {i + 1}. {a.name} {a.email ? `(${a.email})` : ""} — {a.count}
                </li>
              ))
            ) : (
              <li>No deliveries today</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
