import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyParcels from "./pages/MyParcels";
import Parcels from "./pages/Parcels";
import ParcelDetails from "./pages/ParcelDetails";
import BookParcel from "./pages/BookParcel";

import { registerSocket, disconnectSocket } from "./socket";

const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";
  return hideLayout ? <Outlet /> : (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow"><Outlet /></main>
      <Footer />
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector((s) => s.user.currentUser);
  if (!currentUser) return <Navigate to="/" replace />;
  if (!allowedRoles.includes((currentUser.role || "").toLowerCase())) return <Navigate to="/" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const currentUser = useSelector((s) => s.user.currentUser);
  return !currentUser ? children : <Navigate to="/myparcels" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PublicOnlyRoute><Home /></PublicOnlyRoute> },
      { path: "allparcels", element: <Parcels /> },
      {
        path: "myparcels",
        element: (
          <ProtectedRoute allowedRoles={["customer", "delivery-agent"]}>
            <MyParcels />
          </ProtectedRoute>
        ),
      },
      {
        path: "parcel/:id",
        element: (
          <ProtectedRoute allowedRoles={["customer", "delivery-agent"]}>
            <ParcelDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookparcel",
        element: (
          <ProtectedRoute allowedRoles={["customer"]}>
            <BookParcel />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <PublicOnlyRoute><Login /></PublicOnlyRoute> },
  { path: "/register", element: <PublicOnlyRoute><Register /></PublicOnlyRoute> },
]);

const App = () => {
  const currentUser = useSelector((s) => s.user.currentUser);

  // Register / unregister socket whenever auth changes
  useEffect(() => {
    if (currentUser?.email) {
      const role =
        currentUser?.isDeliveryAgent === true ||
        /agent/i.test(currentUser?.role || "")
          ? "agent"
          : "user";
      registerSocket({ email: currentUser.email, role });
    } else {
      disconnectSocket();
    }
  }, [currentUser?.email, currentUser?.role, currentUser?.isDeliveryAgent]);

  return <RouterProvider router={router} />;
};

export default App;
