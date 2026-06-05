import React from "react";
import { Page, Layout, Card, Text, BlockStack, Button } from "@shopify/polaris";

export default function Pricing() {
  return (
    <Page title="Pricing Plans">
      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ flex: 1, border: "2px solid #008060", borderRadius: "10px", padding: "20px", background: "white" }}>
              <Text variant="headingMd" as="h3">Free Plan</Text>
              <Text variant="headingLg" as="p" tone="success">Free</Text>
              <p style={{ fontSize: "13px", color: "gray", margin: "10px 0" }}>Up to 100 wishlisted items per month.</p>
              <div style={{ height: "20px" }}></div>
              <Button fullWidth disabled>Active</Button>
            </div>
            <div style={{ flex: 1, border: "1px solid #e1e3e5", borderRadius: "10px", padding: "20px", background: "white" }}>
              <Text variant="headingMd" as="h3">Pro Vault</Text>
              <Text variant="headingLg" as="p" tone="success">$9.99/mo</Text>
              <p style={{ fontSize: "13px", color: "gray", margin: "10px 0" }}>Unlimited wishlists, analytics + email alerts.</p>
              <div style={{ height: "20px" }}></div>
              <Button variant="primary" fullWidth>Upgrade Now</Button>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
