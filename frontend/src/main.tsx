// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./styles/global.css";
import App from "./App.tsx";
import { persistor, store } from "./redux/store/index.ts";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PersistGate>
  </Provider>

  // </StrictMode>,
);
