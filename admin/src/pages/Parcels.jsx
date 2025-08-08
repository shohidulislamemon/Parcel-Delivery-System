import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { publicRequest } from "../requestMethods";

const Parcels = () => {
  const [data, setData] = useState([]);

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
    { field: "status", headerName: "Status", width: 130 },
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
    const getParcels = async () => {
      try {
        const res = await publicRequest.get("/parcels");

        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getParcels();
  }, []);

  const handleDelete=async(id)=>{
    try {
      await publicRequest.delete(`/parcels/${id}`)
      // window.location.reload();
      
      setData((prev) => prev.filter((parcel) => parcel._id !== id));
    } catch (error) {
      console.log(error);
    }
  }

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
        // getRowId={(row) => row._id}
        // disableSelectionOnClick
        // pageSize={10}
        checkboxSelection
      />
    </div>
  );
};

export default Parcels;
