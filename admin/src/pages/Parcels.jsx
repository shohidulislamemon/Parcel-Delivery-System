import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router";

const Parcels = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 20 },
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
          <button
            className="bg-[#2596be] text-white text-sm px-3 py-1 rounded hover:bg-[#1d7ea1] transition duration-200"
            onClick={() => console.log("Edit", params.row.id)}
          >
            Edit
          </button>
          <button
            className="bg-[#e74c3c] text-white text-sm px-3 py-1 rounded hover:bg-[#c0392b] transition duration-200"
            onClick={() => console.log("Delete", params.row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      senderName: "Alice",
      senderEmail: "alice@example.com",
      recipientName: "Bob",
      recipientEmail: "bob@example.com",
      from: "Dhaka",
      to: "Chittagong",
      weight: 2.5,
      cost: 150,
      status: "Pending",
    },
    {
      id: 2,
      senderName: "John",
      senderEmail: "john@example.com",
      recipientName: "Jane",
      recipientEmail: "jane@example.com",
      from: "Khulna",
      to: "Rajshahi",
      weight: 1.2,
      cost: 100,
      status: "Delivered",
    },
    {
      id: 3,
      senderName: "Rahim",
      senderEmail: "rahim@example.com",
      recipientName: "Karim",
      recipientEmail: "karim@example.com",
      from: "Sylhet",
      to: "Barisal",
      weight: 3,
      cost: 180,
      status: "Processing",
    },
  ];
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
        rows={rows}
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
