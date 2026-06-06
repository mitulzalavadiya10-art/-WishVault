import React, { useState, useEffect } from "react";
import { Page, Layout, Card, Text, BlockStack, Button, InlineStack } from "@shopify/polaris";

export default function Installation() {
  const [openStep, setOpenStep] = useState(1);
  const [shopDomain, setShopDomain] = useState("s-app-store-m.myshopify.com");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shop = params.get("shop");
    if (shop) {
      setShopDomain(shop);
    }
  }, []);

  const handleOpenCustomizer = () => {
    const customizerUrl = `https://${shopDomain}/admin/themes/current/editor?context=apps`;
    window.open(customizerUrl, "_blank");
  };

  const handleGoToSettings = () => {
    // Navigate within the single-page routing structure
    window.location.pathname = "/settings";
  };

  const handleOpenStorefront = () => {
    window.open(`https://${shopDomain}`, "_blank");
  };

  const toggleStep = (step) => {
    setOpenStep(openStep === step ? null : step);
  };

  const stepHeaderStyle = (step) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    padding: "16px",
    background: openStep === step ? "var(--bg-app)" : "transparent",
    borderRadius: "8px",
    transition: "background 0.2s ease",
  });

  return (
    <Page title="Theme Installation Guide">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>⚙️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Step-by-Step Shopify Theme Activation & Setup
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Enable the WishVault storefront button widget. Follow the interactive steps below to activate the app embed and configure your custom wishlist buttons across your store.
            </p>
          </div>
        </div>
      </div>

      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            {/* Step 1 */}
            <Card padding="0">
              <div 
                style={stepHeaderStyle(1)} 
                onClick={() => toggleStep(1)}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
                  <Text variant="headingSm" as="h3">Enable App Embed in Customizer</Text>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 0.2s" }}>
                  {openStep === 1 ? "▲" : "▼"}
                </span>
              </div>
              
              {openStep === 1 && (
                <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                  <BlockStack gap="300">
                    <Text as="p" tone="subdued">
                      Click the button below to open your Shopify Theme Customizer. In the left panel, click the "App Embeds" icon (puzzle piece) and toggle **WishVault Core Widget** to **ON**. This loads the global helper scripts, drawer, and header icons.
                    </Text>
                    <div style={{ marginTop: "10px" }}>
                      <InlineStack gap="300">
                        <Button 
                          variant="primary" 
                          onClick={handleOpenCustomizer}
                          style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}
                        >
                          Open Theme Customizer
                        </Button>
                        <Button 
                          onClick={handleGoToSettings}
                        >
                          Configure Button Design
                        </Button>
                        <Button 
                          onClick={handleOpenStorefront}
                        >
                          View Live Storefront
                        </Button>
                      </InlineStack>
                    </div>
                  </BlockStack>
                </div>
              )}
            </Card>

            {/* Step 2 */}
            <Card padding="0">
              <div 
                style={stepHeaderStyle(2)} 
                onClick={() => toggleStep(2)}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
                  <Text variant="headingSm" as="h3">Configure Placements & Layouts</Text>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 0.2s" }}>
                  {openStep === 2 ? "▲" : "▼"}
                </span>
              </div>
              
              {openStep === 2 && (
                <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                  <BlockStack gap="300">
                    <Text as="p" tone="subdued">
                      Navigate to the **Design & Customization** tab in the WishVault App settings to configure where your buttons show:
                    </Text>
                    <ul style={{ paddingLeft: "20px", color: "var(--text-muted)", fontSize: "13px", lineHeight: "1.6", margin: "10px 0" }}>
                      <li><strong>Product Page (PDP):</strong> Choose to display the button below your "Add to Cart" button, adjacent to it, or right under the price.</li>
                      <li><strong>Collection Cards (PLP):</strong> Automatically inject clickable heart overlays in the top-right or top-left corners of all product listing thumbnails.</li>
                      <li><strong>Header & Global Access:</strong> Add a dedicated wishlist heart next to the header Cart icon, use a floating launcher button in the screen corner, or display both.</li>
                    </ul>
                  </BlockStack>
                </div>
              )}
            </Card>

            {/* Step 3 */}
            <Card padding="0">
              <div 
                style={stepHeaderStyle(3)} 
                onClick={() => toggleStep(3)}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>3</span>
                  <Text variant="headingSm" as="h3">Place Button via Custom Snippet (Optional)</Text>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 0.2s" }}>
                  {openStep === 3 ? "▲" : "▼"}
                </span>
              </div>
              
              {openStep === 3 && (
                <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                  <BlockStack gap="300">
                    <Text as="p" tone="subdued">
                      If you prefer an inline button instead of auto-injecting it, you can turn off auto-placement and add this HTML element directly to your custom liquid templates or product page section:
                    </Text>
                    <div style={{ padding: "12px", background: "var(--bg-app)", borderRadius: "6px", border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: "12.5px", marginTop: "8px" }}>
                      {`<!-- Manual WishVault Button Injection -->`}
                      <br />
                      {`<div class="wishvault-button" data-product="{{ product.id }}"></div>`}
                    </div>
                  </BlockStack>
                </div>
              )}
            </Card>

            {/* Step 4 */}
            <Card padding="0">
              <div 
                style={stepHeaderStyle(4)} 
                onClick={() => toggleStep(4)}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>4</span>
                  <Text variant="headingSm" as="h3">Save Changes</Text>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", transition: "transform 0.2s" }}>
                  {openStep === 4 ? "▲" : "▼"}
                </span>
              </div>
              
              {openStep === 4 && (
                <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
                  <BlockStack gap="300">
                    <Text as="p" tone="subdued">
                      Hit the **Save** button in the top-right corner of the Shopify Customizer. Your storefront will immediately begin displaying the wishlist elements according to your configurations!
                    </Text>
                  </BlockStack>
                </div>
              )}
            </Card>

          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
