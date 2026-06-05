import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/index.css";

// Shopify Polaris App styles are imported if needed, otherwise using standard CSS config
import "@shopify/polaris/build/esm/styles.css";

// Log the injected API key to verify it is loaded correctly
console.log("Loaded Shopify Client ID:", document.querySelector('meta[name="shopify-api-key"]')?.getAttribute("content"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
