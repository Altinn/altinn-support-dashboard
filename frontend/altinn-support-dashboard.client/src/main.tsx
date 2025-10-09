import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "@digdir/designsystemet-theme";
import "@digdir/designsystemet-css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "./stores/Appstore";
import "../design-tokens-build/test2.css";

const queryClient = new QueryClient();

const Root = () => {
  const isDarkmode = useAppStore((state) => state.isDarkMode);

  return (
    <div
      className="app-background"
      data-color-scheme={isDarkmode ? "dark" : "light"}
    >
      <App />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </React.StrictMode>,
);
