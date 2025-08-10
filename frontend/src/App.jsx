import React from "react";
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
import BookParcel from "./pages/BookParcel"; // Import the BookParcel component

// Layout for all routes, except login and register pages
const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return hideLayout ? (
    <Outlet />  // Only renders the Outlet when not on login/register
  ) : (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ProtectedRoute component that can handle multiple roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If user's role doesn't match allowed roles, redirect to homepage
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// PublicOnlyRoute component that prevents logged-in users from accessing login/register pages
const PublicOnlyRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  return !currentUser ? children : <Navigate to="/myparcels" replace />;
};

// Router setup
const router = createBrowserRouter([
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
        path: "bookparcel", // Add the bookparcel route for customer
        element: (
          <ProtectedRoute allowedRoles={["customer"]}>
            <BookParcel />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
