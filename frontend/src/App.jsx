import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MyParcels from "./pages/MyParcels";
import Parcels from "./pages/Parcels";
import ParcelDetails from "./pages/ParcelDetails";

const isLoggedIn = true;

const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="w-[100%]">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  return !isLoggedIn ? children : <Navigate to="/myparcels" replace />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PublicOnlyRoute>
            <Home />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "allparcels",
        element: <Parcels />,
      },
      {
        path: "myparcels",
        element: (
          <ProtectedRoute>
            <MyParcels />
          </ProtectedRoute>
        ),
      },
      {
        path: "parcel/:id",
        element: (
          <ProtectedRoute>
            <ParcelDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
