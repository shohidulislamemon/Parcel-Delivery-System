import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router";

const Users = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
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
      name: "Shohidul Islam",
      email: "shohid@example.com",
      role: "Customer",
      phone: "01711223344",
      address: "Dhaka, Bangladesh",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      phone: "01811224455",
      address: "Khulna, Bangladesh",
      status: "Suspended",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Delivery Agent",
      phone: "01611335566",
      address: "Chittagong, Bangladesh",
      status: "Active",
    },
  ];

  return (
    <div className="m-[30] bg-[#fff] p-[20px]">
      <div className="flex items-center justify-between">
        <h1 className="m-[20px] text-[20px] text-[#24bfd7]">All Users</h1>
        <Link to ="/newuser">
          <button className="bg-[#26a0ab] text-[#fff] p-[10px] cursor-pointer">
            New User
          </button>
        </Link>
      </div>
      <DataGrid rows={rows} columns={columns} checkboxSelection />
    </div>
  );
};

export default Users;
