import "@shopify/shopify-api/adapters/node";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

dotenv.config();

const port = 8081;

// Initialize Shopify API context
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "dummy_key",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "dummy_secret",
  scopes: (process.env.SCOPES || "write_products,read_products").split(","),
  hostName: (process.env.SHOPIFY_APP_URL || "localhost:8081").replace(/https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
});

const app = express();
app.use(cors());
app.use(express.json());

// Content Security Policy middleware for Shopify framing
app.use((req, res, next) => {
  const shop = req.query.shop || req.headers["x-shop-domain"];
  if (shop) {
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors https://admin.shopify.com https://${shop} https://*.myshopify.com;`
    );
  } else {
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors https://admin.shopify.com https://*.myshopify.com;"
    );
  }
  next();
});

// API endpoints proxy
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the Shopify Express backend!" });
});

// OAuth authentication entrypoint
app.get("/api/auth", async (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).send("Missing shop parameter.");
  }
  
  // Here we would begin the OAuth flow redirect using shopify.auth.begin
  res.send(`Initiating authentication flow for shop: ${shop}`);
});

// OAuth callback handler
app.get("/api/auth/callback", async (req, res) => {
  res.send("Authentication callback received.");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
