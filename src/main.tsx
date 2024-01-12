import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import bridge from "@/gas-client";

bridge;

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
