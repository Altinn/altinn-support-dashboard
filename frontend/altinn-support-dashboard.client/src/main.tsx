import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import "@digdir/designsystemet-theme";
import "@digdir/designsystemet-css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
