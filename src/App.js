import React from "react";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PDFUploader from "./components/PDFUploader";
import Navbar from "./components/Navbar";
import RootLayout from "./components/RootLayout";
import RegisterForm from './components/RegisterForm';
import Login from './components/Login';
import AuthRequired from "./components/route-protection/AuthRequired";
import AIAdvicePage from './components/AIAdvicePage';

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
          element: <AuthRequired><Dashboard /></AuthRequired>,
        },
        {
          path: "/upload-pdf",
          element: <AuthRequired><PDFUploader /></AuthRequired>,
        },
         {
          path: "/login",
          element: <Login/>,
        },
         {
          path: "/Register",
          element: <RegisterForm/>,
        },
         {
          path: "/ai-advice",
          element: <AuthRequired><AIAdvicePage/></AuthRequired>,
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
