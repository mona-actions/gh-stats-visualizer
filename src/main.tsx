/**
 * main.tsx
 *
 * The entry point for the GitHub stats analysis dashboard application.
 * Renders the root App component into the DOM using React 19's createRoot API.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
