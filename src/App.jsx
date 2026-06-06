import React, { useState, useEffect } from "react";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

import Dashboard from "./pages/Dashboard.jsx";
import WishlistItems from "./pages/WishlistItems.jsx";
import Analytics from "./pages/Analytics.jsx";
import Orders from "./pages/Orders.jsx";
import Settings from "./pages/Settings.jsx";
import Installation from "./pages/Installation.jsx";
import Pricing from "./pages/Pricing.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Onboarding from "./pages/Onboarding.jsx";

// ── Derive shop param from URL once ──────────────────────────────────────────
function getShopFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("shop") || "default-store.myshopify.com";
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [appEmbedActive, setAppEmbedActive] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsData, setSettingsData] = useState(null);

  const shop = getShopFromUrl();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasShop = params.has("shop") || params.has("host");
    const inIframe = window.self !== window.top;
    setIsEmbedded(hasShop || inIframe);

    const handleLocationChange = () => setCurrentPath(window.location.pathname);

    // Always pass shop param so we hit the right DB record
    fetch(`/api/settings?shop=${encodeURIComponent(shop)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettingsData(data);
          setAppEmbedActive(data.appEmbedActive);
        }
        setSettingsLoaded(true);
      })
      .catch(() => setSettingsLoaded(true));

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const handleOnboardingVerify = () => {
    return new Promise((resolve, reject) => {
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settingsData, shop, appEmbedActive: true }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAppEmbedActive(true);
            setSettingsData(data.settings);
            resolve();
          } else reject();
        })
        .catch(reject);
    });
  };

  const renderContent = () => {
    switch (currentPath) {
      case "/wishlist":    return <WishlistItems shop={shop} />;
      case "/analytics":  return <Analytics />;
      case "/orders":     return <Orders />;
      case "/settings":   return <Settings shop={shop} />;
      case "/installation": return <Installation />;
      case "/pricing":    return <Pricing />;
      case "/admin":      return <AdminPanel shop={shop} />;
      case "/":
      default:            return <Dashboard shop={shop} />;
    }
  };

  if (!isEmbedded) return <LandingPage />;

  if (!settingsLoaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "var(--text-muted)" }}>
        Loading...
      </div>
    );
  }

  return (
    <AppProvider i18n={enTranslations}>
      {!appEmbedActive && currentPath !== "/admin" && (
        <Onboarding onVerify={handleOnboardingVerify} />
      )}

      <s-app-nav>
        <s-link href="/" rel="home">Home</s-link>
        <s-link href="/wishlist">Wishlisted Items</s-link>
        <s-link href="/analytics">Analytics</s-link>
        <s-link href="/orders">Orders</s-link>
        <s-link href="/settings">Settings</s-link>
        <s-link href="/installation">Installation</s-link>
        <s-link href="/pricing">Pricing Plan</s-link>
        <s-link href="/admin">Admin Panel</s-link>
      </s-app-nav>

      <div style={{ padding: "10px 0" }}>
        {renderContent()}
      </div>
    </AppProvider>
  );
}
