import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from the current directory
  const env = loadEnv(mode, process.cwd(), "");

  // Use the port assigned by Shopify CLI (process.env.PORT) or default to 5173
  const port = parseInt(process.env.PORT || "5173", 10);

  return {
    plugins: [
      react(),
      {
        name: "html-transform",
        transformIndexHtml(html) {
          return html.replace(
            /%SHOPIFY_API_KEY%/g,
            env.SHOPIFY_API_KEY || ""
          );
        },
      },
    ],
    server: {
      port: port,
      host: true,
      allowedHosts: true, // Allow tunnel hosts like Cloudflare and Ngrok
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8081",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
