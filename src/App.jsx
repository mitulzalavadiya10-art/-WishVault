import React, { useState, useEffect } from "react";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

// Import page components
import Dashboard from "./pages/Dashboard.jsx";
import WishlistItems from "./pages/WishlistItems.jsx";
import Analytics from "./pages/Analytics.jsx";
import Orders from "./pages/Orders.jsx";
import Settings from "./pages/Settings.jsx";
import Installation from "./pages/Installation.jsx";
import Pricing from "./pages/Pricing.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Synchronize dynamic routing state and check if embedded in Shopify iframe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasShop = params.has("shop") || params.has("host");
    const inIframe = window.self !== window.top;
    setIsEmbedded(hasShop || inIframe);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Render correct page view based on path
  const renderContent = () => {
    switch (currentPath) {
      case "/wishlist":
        return <WishlistItems />;
      case "/analytics":
        return <Analytics />;
      case "/orders":
        return <Orders />;
      case "/settings":
        return <Settings />;
      case "/installation":
        return <Installation />;
      case "/pricing":
        return <Pricing />;
      case "/":
      default:
        return <Dashboard />;
    }
  };

  // If not embedded, render the public-facing Vercel landing page
  if (!isEmbedded) {
    return <LandingPage />;
  }

  // Otherwise render the Polaris Embedded merchant dashboard view
  return (
    <AppProvider i18n={enTranslations}>
      {/* Shopify App Bridge Sidebar Navigation Menu */}
      <s-app-nav>
        <s-link href="/" rel="home">Home</s-link>
        <s-link href="/wishlist">Wishlisted Items</s-link>
        <s-link href="/analytics">Analytics</s-link>
        <s-link href="/orders">Orders</s-link>
        <s-link href="/settings">Settings</s-link>
        <s-link href="/installation">Installation</s-link>
        <s-link href="/pricing">Pricing Plan</s-link>
      </s-app-nav>

      <div style={{ padding: "10px 0" }}>
        {renderContent()}
      </div>
    </AppProvider>
  );
}
