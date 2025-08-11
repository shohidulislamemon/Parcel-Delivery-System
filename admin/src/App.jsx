
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Parcels from "./pages/Parcels";
import Parcel from "./pages/Parcel";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NewParcel from "./pages/NewParcel";
import NewUser from "./pages/NewUser";
import DeliveryAgents from "./pages/DeliveryAgents";
import CreateDeliveryAgent from "./pages/CreateDeliveryAgent";
import AgentDetails from "./pages/AgentDetails";
import { connectAndRegister } from "./socket";

const App = () => {
  

  const Layout = () => (
    <div>
      <Navbar />
      <div className="flex">
        <div className="w-[20%]">
          <Menu />
        </div>
        <div className="w-[80%]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/parcels", element: <Parcels /> },
        { path: "/parcel/:parcelId", element: <Parcel /> },
        { path: "/users", element: <Users /> },
        { path: "/newparcel", element: <NewParcel /> },
        { path: "/newuser", element: <NewUser /> },
        { path: "/delivery-agents", element: <DeliveryAgents /> },
        { path: "/addagent", element: <CreateDeliveryAgent /> },
        { path: "/delivery-agents/:agentId", element: <AgentDetails /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
