
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import Home from "./pages/Home"
import Login from "./pages/Login"
import MyParcels from "./pages/MyParcels"
import Parcels from "./pages/Parcels"
import ParcelDetails from "./pages//ParcelDetails"



const App = () => {

  const router=createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/myparcels",
      element: <MyParcels />,
    },
    {
      path: "/parcel/:id",
      element: <ParcelDetails />,
    },
    {
      path: "/allparcels",
      element: <Parcels />,
    },
  
  ])


  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App