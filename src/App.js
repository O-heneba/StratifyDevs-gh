import React from "react";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PDFUploader from "./components/PDFUploader";
import Navbar from "./components/Navbar";
import RootLayout from "./components/RootLayout";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
      index:true,
      element:<Home/>
    },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/upload-pdf",
          element: <PDFUploader />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
