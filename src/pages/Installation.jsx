import React from "react";
import { Page, Layout, Card, Text, BlockStack, Button } from "@shopify/polaris";

export default function Installation() {
  return (
    <Page title="Theme Installation Guide">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>⚙️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Step-by-Step Shopify Theme Activation
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Enable the WishVault storefront button widget. Follow the simple visual guide below to activate the app embed within your current Shopify Online Store theme customizer.
            </p>
          </div>
        </div>
      </div>

      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Step 1 */}
            <Card>
              <BlockStack gap="300">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>1</span>
                  <Text variant="headingSm" as="h3">Enable App Embed in Customizer</Text>
                </div>
                <Text as="p" tone="subdued">
                  Click the button below to open your Shopify Theme Customizer. In the left panel, click the "App Embeds" icon and toggle **WishVault Core Widget** to **ON**.
                </Text>
                <div style={{ marginTop: "10px" }}>
                  <Button variant="primary" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}>
                    Open Theme Customizer
                  </Button>
                </div>
              </BlockStack>
            </Card>

            {/* Step 2 */}
            <Card>
              <BlockStack gap="300">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>2</span>
                  <Text variant="headingSm" as="h3">Place Button via App Blocks (Optional)</Text>
                </div>
                <Text as="p" tone="subdued">
                  If you prefer an inline button instead of the floating drawer, you can add it as a block directly under your product price details inside your Product Template.
                </Text>
                <div style={{ padding: "12px", background: "var(--bg-app)", borderRadius: "6px", border: "1px solid var(--border-color)", fontFamily: "monospace", fontSize: "12.5px" }}>
                  {`<!-- The widget will render in place of this block -->`}
                  <br />
                  {`<div class="wishvault-button" data-product="{{ product.id }}"></div>`}
                </div>
              </BlockStack>
            </Card>

            {/* Step 3 */}
            <Card>
              <BlockStack gap="300">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>3</span>
                  <Text variant="headingSm" as="h3">Save Changes</Text>
                </div>
                <Text as="p" tone="subdued">
                  Hit the **Save** button in the top-right corner of the Shopify Customizer. Your storefront will immediately begin displaying the wishlist widgets matching your preset custom colors!
                </Text>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
