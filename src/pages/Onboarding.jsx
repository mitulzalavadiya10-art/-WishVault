import React, { useState } from "react";
import { Card, Text, Button, BlockStack, Banner } from "@shopify/polaris";

export default function Onboarding({ onVerify }) {
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Parse shop domain to generate deep-link to theme embeds editor
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop") || "s-app-store-m.myshopify.com";
  const shopName = shop.replace(".myshopify.com", "");
  const customizerUrl = `https://admin.shopify.com/store/${shopName}/themes/current/editor?context=apps`;

  const handleVerify = () => {
    setVerifying(true);
    setErrorMsg("");

    // Execute verification callback
    onVerify()
      .then(() => {
        setVerifying(false);
      })
      .catch((err) => {
        setVerifying(false);
        setErrorMsg("Verification failed. Please ensure you saved the theme embeds.");
      });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(101, 82, 70, 0.4)", // Muted brown tint overlay
      backdropFilter: "blur(8px)", // Blur background app content
      WebkitBackdropFilter: "blur(8px)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: "580px", width: "100%", animation: "fadeUp 0.3s ease" }}>
        <BlockStack gap="500">
          {/* Earthy Branding Header Card */}
          <div style={{
            background: "linear-gradient(135deg, #655246 0%, #4d3e35 100%)",
            color: "white",
            padding: "2.5rem 2rem",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(101, 82, 70, 0.15)"
          }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", margin: 0 }}>
              Welcome to WishVault
            </h1>
            <p style={{ fontSize: "14px", opacity: 0.85, marginTop: "8px", lineHeight: "1.4" }}>
              Activate the floating wishlist widget on your online store to start capturing customer leads.
            </p>
          </div>

          {errorMsg && <Banner tone="critical">{errorMsg}</Banner>}

          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Onboarding Checklist</Text>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
                {/* Step 1 */}
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <span style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--bg-app)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "13px",
                    flexShrink: 0
                  }}>1</span>
                  <div>
                    <h3 style={{ margin: "2px 0 4px", fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)" }}>
                      Open Shopify Theme Customizer
                    </h3>
                    <Text as="p" tone="subdued">
                      Click below to deep-link to the Theme Editor embeds drawer.
                    </Text>
                    <div style={{ marginTop: "10px" }}>
                      <Button 
                        variant="primary" 
                        style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                        url={customizerUrl}
                        external
                      >
                        Open Theme Customizer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <span style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--bg-app)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "13px",
                    flexShrink: 0
                  }}>2</span>
                  <div>
                    <h3 style={{ margin: "2px 0 4px", fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)" }}>
                      Toggle "WishVault Core" ON
                    </h3>
                    <Text as="p" tone="subdued">
                      Toggle the **WishVault Core Widget** to active (**ON**) in the customizer embeds panel, and click **Save** in the top right.
                    </Text>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <span style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--bg-app)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "13px",
                    flexShrink: 0
                  }}>3</span>
                  <div>
                    <h3 style={{ margin: "2px 0 4px", fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)" }}>
                      Verify & Activate Dashboard
                    </h3>
                    <Text as="p" tone="subdued">
                      Confirm configuration theme app embed settings are saved to unlock all panels.
                    </Text>
                    <div style={{ marginTop: "12px" }}>
                      <Button 
                        variant="primary" 
                        loading={verifying}
                        onClick={handleVerify}
                      >
                        Verify & Unlock App
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </BlockStack>
          </Card>
        </BlockStack>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
