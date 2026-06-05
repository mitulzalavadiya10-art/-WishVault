import React from "react";
import { Page, Layout, Card, Text, BlockStack, Button } from "@shopify/polaris";

export default function Pricing() {
  return (
    <Page title="Pricing Plans">
      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1, border: "2px solid var(--primary)", borderRadius: "10px", padding: "20px", background: "white" }}>
              <Text variant="headingMd" as="h3">Free Plan</Text>
              <Text variant="headingLg" as="p" style={{ color: "var(--primary)", fontWeight: "bold", margin: "5px 0" }}>Free</Text>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "10px 0" }}>Up to 100 wishlisted items per month.</p>
              <div style={{ height: "20px" }}></div>
              <Button fullWidth disabled>Active</Button>
            </div>
            <div style={{ flex: 1, border: "1px solid var(--border-color)", borderRadius: "10px", padding: "20px", background: "white" }}>
              <Text variant="headingMd" as="h3">Pro Vault</Text>
              <Text variant="headingLg" as="p" style={{ color: "var(--text-main)", fontWeight: "bold", margin: "5px 0" }}>$9.99/mo</Text>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "10px 0" }}>Unlimited wishlists, analytics + email alerts.</p>
              <div style={{ height: "20px" }}></div>
              <Button variant="primary" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }} fullWidth>Upgrade Now</Button>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
