import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";


// one QueryClient for the whole app — handles caching, refetching, stale time
const queryclient = new QueryClient({
  defaults: {
    queries: {
      retry: 1, 
      staleTime: 30000, 
      refetchOnWindowFocus: false, 
    },
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryclient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
