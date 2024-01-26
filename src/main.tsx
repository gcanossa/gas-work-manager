import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import bridge from "@/gas-client";
import Invoice from "./pages/invoice.tsx";
import TimeTracker from "./pages/time-tracker.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type GoogleClientApi } from "@gcanossa/gas-app";
import { type appAPI } from "@server";
declare global {
  interface Window {
    initialRoute: string | null;
    google: GoogleClientApi<appAPI>;
  }
}

if (bridge) {
  const router = createHashRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "invoice",
          element: <Invoice />,
        },
        {
          path: "time-tracker",
          element: <TimeTracker />,
        },
      ],
    },
  ]);

  const queryClient = new QueryClient();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
} else {
  document.querySelector("#root")!.innerHTML = `
  <div style="display:flex;justify-content:center; align-items: center; height: 60vh;text-align: center; padding: 1rem; min-width: 0px;">
  <p>This was meant to be used through a <strong>Google Script App</strong></p>
  </div>`;
}
