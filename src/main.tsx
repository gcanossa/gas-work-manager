import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import App from "./App";
import { createHashRouter, RouterProvider } from "react-router-dom";
import client from "@/gas-client";
import NewInvoice from "./pages/new-invoice";
import TrackTime from "./pages/track-time";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ClientApi } from "@gasstack/rpc";
import { type ServerApiType } from "@server";
import NewClient from "./pages/new-client.tsx";
import NewProject from "./pages/new-project";
import { Toaster } from "@/components/ui/sonner";
declare global {
  interface Window {
    initialRoute: string | null;
    google: ClientApi<ServerApiType>;
  }
}

if (client) {
  const router = createHashRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "new-invoice",
          element: <NewInvoice />,
        },
        {
          path: "new-client",
          element: <NewClient />,
        },
        {
          path: "new-project",
          element: <NewProject />,
        },
        {
          path: "track-time",
          element: <TrackTime />,
        },
      ],
    },
  ]);

  const queryClient = new QueryClient();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>,
  );
} else {
  document.querySelector("#root")!.innerHTML = `
  <div style="display:flex;justify-content:center; align-items: center; height: 60vh;text-align: center; padding: 1rem; min-width: 0px;">
  <p>This was meant to be used through a <strong>Google Script App</strong></p>
  </div>`;
}
