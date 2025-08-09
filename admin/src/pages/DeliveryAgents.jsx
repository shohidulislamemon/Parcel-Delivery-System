import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicRequest } from "../requestMethods";

const DeliveryAgents = () => {
  const [data, setData] = useState([]);
  
  // Columns definition for Delivery Agents
  const columns = [
    { field: "_id", headerName: "ID", width: 60 },
    { field: "fullname", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "division", headerName: "Division", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    {
          field: "actions",
          headerName: "Actions",
          width: 180,
          renderCell: (params) => (
            <div className="flex gap-2">
              <Link to={`/delivery-agents/${params.row._id}`}>
                <button className="w-[70px] bg-[#2596be] text-white text-sm px-3 py-1 rounded hover:bg-[#1d7ea1] transition duration-200">
                  Edit
                </button>
              </Link>
              <Link>
              <button
                className="w-[70px] bg-[#e74c3c] text-white text-sm px-3 py-1 rounded hover:bg-[#c0392b] transition duration-200"
                onClick={()=>handleDelete(params.row._id)}
              >
                Delete
              </button>
              </Link>
            </div>
          ),
        },
  ];

  useEffect(() => {
    const getDeliveryAgents = async () => {
      try {
        const res = await publicRequest.get("/delivery-agents");

        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDeliveryAgents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await publicRequest.delete(`/delivery-agents/${id}`);
      // Remove deleted agent from the UI without reloading
      setData((prev) => prev.filter((agent) => agent._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="m-[30] bg-[#fff] p-[20px]">
      <div className="flex items-center justify-between">
        <h1 className="m-[20px] text-[20px] text-[#24bfd7]">All Delivery Agents</h1>
        <Link to="/addagent">
          <button className="bg-[#26a0ab] text-[#fff] p-[10px] cursor-pointer">
            New Delivery Agent
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

export default DeliveryAgents;
