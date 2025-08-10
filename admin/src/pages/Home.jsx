import React, { useEffect, useState } from "react";
import { HiArrowSmallUp, HiArrowLongDown } from "react-icons/hi2";
import { PieChart } from "@mui/x-charts/PieChart";
import {publicRequest} from "../requestMethods";

const Home = () => {
  const [parcels, setParcels] = useState([]);
  const [users, setUsers] = useState([]);

  const usersCount=users.length;
  const deliveredCount=parcels.filter(parcel=>parcel.status==4).length;
  const pendingCount=parcels.filter(parcel=>parcel.status==1).length;


  useEffect(() => {
    const getParcels = async () => {
      try {
        const res = await publicRequest.get("/parcels");
        setParcels(res.data);
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
        setUsers(res.data);
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
                  { id: 1, value: 45, label: "In Transit" },
                  { id: 2, value: deliveredCount, label: "Delivered " },
                  { id: 4, value: 9, label: "Returned" },
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
          <h2 className="flex px-[20px] text-[#24bfd7]">Recent Users</h2>
          <ol className="flex font-semibold flex-col justify-end px-[20px] mt-[10px] text-[#24bfd7]">
            <li>1. Jhon Doe</li>
            <li>2.Shekh Hasina</li>
            <li>3.Kalida Hasina</li>
            <li>4.Shekh Hasina</li>
            <li>5.Alex Man</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
