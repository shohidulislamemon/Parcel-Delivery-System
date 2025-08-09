import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import MyParcels from "./pages/MyParcels";
import Parcels from "./pages/Parcels";
import ParcelDetails from "./pages/ParcelDetails";

const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return hideLayout ? (
    <Outlet />
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

const ProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  return currentUser ? children : <Navigate to="/" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  return !currentUser ? children : <Navigate to="/myparcels" replace />;
};

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
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
