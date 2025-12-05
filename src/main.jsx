import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/router/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);
