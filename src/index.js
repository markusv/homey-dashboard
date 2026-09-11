import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Stue } from "./pages/Stue/Stue";
import { Entre } from "./pages/Entre/Entre";
import { Andre } from "./pages/Andre/Andre";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Stue />,
  },
  {
    path: "/entre",
    element: <Entre />,
  },
  {
    path: "/andre",
    element: <Andre />,
  },
]);

const initApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

window.addEventListener("load", initApp);
