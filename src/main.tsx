import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import bridge from "@/gas-client";

if (bridge) {
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
} else {
  document.querySelector("#root")!.innerHTML = `
  <div style="display:flex;justify-content:center; align-items: center; height: 60vh;">
  <p>This was meant to be used through a <strong>Google Script App</strong></p>
  </div>`;
}
