import React, { useState, useEffect } from "react";
import { Page, Layout, Card, Text, Button, BlockStack, InlineStack, Banner, TextField } from "@shopify/polaris";

export default function AdminPanel() {
  const [dbStatus, setDbStatus] = useState("Connected");
  const [totalSessions, setTotalSessions] = useState(1);
  const [rawWishlists, setRawWishlists] = useState([]);
  const [rawSettings, setRawSettings] = useState(null);
  const [mailHistory, setMailHistory] = useState([]);
  const [simulatedEmail, setSimulatedEmail] = useState("mitulzalavadiya10@gmail.com");
  const [simulatedProduct, setSimulatedProduct] = useState("8888");
  const [simulatedPrice, setSimulatedPrice] = useState("89.00");
  const [bannerMsg, setBannerMsg] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  // Load backend details
  const loadSystemInfo = () => {
    fetch("/api/wishlist")
      .then(res => res.json())
      .then(data => setRawWishlists(data || []))
      .catch(() => setDbStatus("Disconnected"));

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setRawSettings(data))
      .catch(() => setDbStatus("Disconnected"));

    fetch("/api/mail-history")
      .then(res => res.json())
      .then(data => setMailHistory(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadSystemInfo();
  }, []);

  // Plan Switcher
  const handleSwitchPlan = (planName) => {
    if (!rawSettings) return;

    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rawSettings,
        activePlan: planName
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBannerMsg(`App billing plan successfully switched to: ${planName}`);
          setShowBanner(true);
          loadSystemInfo();
        }
      });
  };

  // Simulator handler: Wishlist Add
  const handleSimulateAdd = () => {
    fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "sim_101",
        customerEmail: simulatedEmail,
        productId: simulatedProduct,
        productTitle: "Simulated Luxury Linen",
        productPrice: "$129.00",
        productImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=80&q=80"
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBannerMsg(`Mock Wishlist item created for ${simulatedEmail} at original price $129.00. Ready for Price Drop trigger!`);
          setShowBanner(true);
          loadSystemInfo();
        }
      });
  };

  // Simulator handler: Send Shopify Webhook payload mock post
  const handleSimulatePriceDropWebhook = () => {
    setBannerMsg("Triggering mock Shopify Webhook... Sending product update payload.");
    setShowBanner(true);

    fetch("/api/webhooks/products-update", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Shopify-Shop-Domain": "default-store.myshopify.com"
      },
      body: JSON.stringify({
        id: simulatedProduct,
        title: "Simulated Luxury Linen",
        handle: "simulated-luxury-linen",
        variants: [
          {
            id: 9999,
            price: simulatedPrice,
            inventory_quantity: 15
          }
        ]
      })
    })
      .then(res => {
        if (res.status === 200) {
          setBannerMsg(`[Webhook Verified] Webhook executed! Price Drop Email alert dispatched to ${simulatedEmail}. Check Wishlist Mail History logs!`);
          setShowBanner(true);
          loadSystemInfo();
        } else {
          setBannerMsg("Webhook execution failed.");
          setShowBanner(true);
        }
      })
      .catch(err => {
        console.error("Webhook simulation error:", err);
      });
  };

  // Reset settings
  const handleResetSettings = () => {
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        primaryColor: "#655246",
        secondaryColor: "#f7f4f0",
        textColor: "#332b26",
        buttonStyle: "pill-sand",
        buttonText: "Add to Wishlist",
        emailSubject: "An item in your wishlist has dropped in price!",
        emailGreeting: "Great news! We noticed a price drop on something you love.",
        activePlan: "Free",
        appEmbedActive: false
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBannerMsg("App settings reset to standard Warm Sand & Espresso theme!");
          setShowBanner(true);
          loadSystemInfo();
        }
      });
  };

  const handleResetEmbed = () => {
    if (!rawSettings) return;
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rawSettings,
        appEmbedActive: false
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBannerMsg("App Embed status reset successfully! Onboarding lock has been re-enabled for testing.");
          setShowBanner(true);
          loadSystemInfo();
        }
      });
  };

  // Unique users list generator
  const getUniqueUsers = () => {
    const userMap = {};
    rawWishlists.forEach(item => {
      const email = item.customerEmail || "Guest User";
      if (!userMap[email]) {
        userMap[email] = {
          name: item.customerId ? `Customer #${item.customerId}` : "Guest Shopper",
          email: email,
          itemCount: 0,
          joined: new Date(item.createdAt).toLocaleDateString()
        };
      }
      userMap[email].itemCount++;
    });
    return Object.values(userMap);
  };

  const uniqueUsers = getUniqueUsers();

  return (
    <Page title="System Admin Panel">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>🔧</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Developer Diagnostics & Simulation Console
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Test end-to-end webhook pricing checks, dispatch Nodemailer Ethereal simulation sandboxes, view active user database directories, and manage app billing plans.
            </p>
          </div>
        </div>
      </div>

      {showBanner && (
        <div style={{ marginBottom: "15px" }}>
          <Banner title={bannerMsg} onDismiss={() => setShowBanner(false)} tone="info" />
        </div>
      )}

      <Layout>
        {/* System Health Check & Plan Switcher */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px" }}>
            {/* Integrity statistics */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">System Integrity & Diagnostics</Text>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "10px" }}>
                  <div style={{ padding: "10px", background: "var(--bg-app)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <Text variant="bodyXs" tone="subdued">DB connection</Text>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: dbStatus === "Connected" ? "#4caf50" : "#d32f2f", marginTop: "4px" }}>
                      ● {dbStatus}
                    </div>
                  </div>
                  <div style={{ padding: "10px", background: "var(--bg-app)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <Text variant="bodyXs" tone="subdued">Active sessions</Text>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-main)", marginTop: "4px" }}>
                      {totalSessions} Active
                    </div>
                  </div>
                  <div style={{ padding: "10px", background: "var(--bg-app)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <Text variant="bodyXs" tone="subdued">Total saved wishlists</Text>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--primary)", marginTop: "4px" }}>
                      {rawWishlists.length} Entries
                    </div>
                  </div>
                </div>
              </BlockStack>
            </Card>

            {/* Plan switcher */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">Store Plan Billing Management</Text>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                  <div>
                    <Text variant="bodySm" tone="subdued">Active Plan</Text>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--primary)", marginTop: "2px" }}>
                      {rawSettings?.activePlan || "Free"} Plan
                    </div>
                  </div>
                  <InlineStack gap="200">
                    <Button 
                      variant={rawSettings?.activePlan === "Free" ? "primary" : "secondary"}
                      onClick={() => handleSwitchPlan("Free")}
                    >
                      Set Free
                    </Button>
                    <Button 
                      variant={rawSettings?.activePlan === "Pro" ? "primary" : "secondary"}
                      onClick={() => handleSwitchPlan("Pro")}
                    >
                      Set Pro
                    </Button>
                  </InlineStack>
                </div>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        {/* Registered Shoppers Directory */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">Registered Shoppers Directory ({uniqueUsers.length} Users)</Text>
              <div style={{ overflowX: "auto", marginTop: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Customer Name</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Email Address</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Wishlisted Products</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Joined On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueUsers.map((user, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "12px 10px", fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{user.name}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>{user.email}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13.5px", fontWeight: "700", color: "var(--primary)" }}>{user.itemCount} items</td>
                        <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>{user.joined}</td>
                      </tr>
                    ))}
                    {uniqueUsers.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>No shoppers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Wishlist Alert Simulator */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Ecosystem Event Simulator</Text>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
                {/* Add Wishlist Entry */}
                <div style={{ padding: "15px", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <Text variant="headingSm" as="h3">Step 1: Save Mock Wishlist Item</Text>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "5px 0 15px 0" }}>
                    Creates a mock wishlist entry initialized at $129.00.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <TextField label="Shopper Email" value={simulatedEmail} onChange={(val) => setSimulatedEmail(val)} autoComplete="off" />
                    <TextField label="Product ID" value={simulatedProduct} onChange={(val) => setSimulatedProduct(val)} autoComplete="off" />
                    <Button variant="primary" onClick={handleSimulateAdd}>Create Mock Wishlist Entry</Button>
                  </div>
                </div>

                {/* Trigger Price Drop Alert */}
                <div style={{ padding: "15px", border: "1px solid var(--border-color)", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Text variant="headingSm" as="h3">Step 2: Trigger Webhook Price Drop</Text>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "5px 0 15px 0" }}>
                      Sends a mock Shopify webhook payload. If the price is dropped below $129.00, it triggers Nodemailer.
                    </p>
                    <TextField label="New Webhook Price ($)" value={simulatedPrice} onChange={(val) => setSimulatedPrice(val)} autoComplete="off" />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Button variant="primary" onClick={handleSimulatePriceDropWebhook} fullWidth>Trigger Price Webhook POST</Button>
                  </div>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Sent Email Alert Logs */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">Automated Email Alert Logs ({mailHistory.length} Emails)</Text>
              <div style={{ overflowX: "auto", marginTop: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Recipient Email</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Subject Line</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Alert Type</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Sent At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mailHistory.map((log, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "10px", fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>{log.email}</td>
                        <td style={{ padding: "10px", fontSize: "13px", color: "var(--text-muted)" }}>{log.subject}</td>
                        <td style={{ padding: "10px", fontSize: "13px" }}>
                          <span style={{ background: "var(--border-color)", color: "var(--primary)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
                            {log.type}
                          </span>
                        </td>
                        <td style={{ padding: "10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>
                          {new Date(log.sentAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {mailHistory.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "13px" }}>No automated email logs found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Maintenance Controls */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Maintenance & Recovery Controls</Text>
              <InlineStack gap="300">
                <Button onClick={handleResetSettings}>Reset Styles to Earthy Theme Default</Button>
                <Button variant="secondary" onClick={loadSystemInfo}>Refresh System Log Data</Button>
                <Button onClick={handleResetEmbed}>Reset App Embed Onboarding Status</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
