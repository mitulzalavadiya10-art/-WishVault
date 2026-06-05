import React from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, Banner } from "@shopify/polaris";

export default function Dashboard() {
  return (
    <Page title="Hello">
      <Text tone="subdued" as="p" variant="bodyMd">
        It's so good to see you here.
      </Text>
      <div style={{ height: "20px" }}></div>

      <Layout>
        {/* Setup Guide Banner */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">
                  Active app blocks & Setup Guide
                </Text>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <Button variant="tertiary">View details</Button>
                  <Button variant="plain" icon="CancelIcon">✕</Button>
                </div>
              </InlineStack>
              <Text as="p" tone="subdued">
                0 / 4 completed
              </Text>
              <div style={{ width: "100%", background: "#e1e3e5", height: "8px", borderRadius: "4px" }}>
                <div style={{ width: "0%", background: "#008060", height: "8px", borderRadius: "4px" }}></div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Wishlist addition limits */}
        <Layout.Section>
          <Text variant="bodySm" as="p" tone="subdued">
            0/ 100 Wishlist additions
          </Text>
          <div style={{ width: "100%", background: "#e1e3e5", height: "4px", borderRadius: "2px", marginTop: "5px" }}>
            <div style={{ width: "0%", background: "#008060", height: "4px", borderRadius: "2px" }}></div>
          </div>
        </Layout.Section>

        {/* 8 Stats Metrics Grid */}
        <Layout.Section>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "10px"
          }}>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Wishlist page views</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Customers with wishlist</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Total wishlists</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Unique products wishlisted</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Added to cart from wishlist</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Orders from wishlist</Text>
                <Text variant="headingXl" as="p">0</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Average Order Value</Text>
                <Text variant="headingXl" as="p">$0.00</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="100">
                <Text variant="bodyMd" as="p" tone="subdued">Revenue from Wishlist</Text>
                <Text variant="headingXl" as="p">$0.00</Text>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>

        {/* Top 10 Table */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Top 10 Items in public wishlists</Text>
              <div style={{ borderTop: "1px solid #e1e3e5", padding: "10px 0" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "#6d7175", fontSize: "12px" }}>
                      <th style={{ padding: "8px 0" }}>Product</th>
                      <th style={{ padding: "8px 0", textAlign: "right" }}>Wishlists</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center", padding: "40px 0", color: "#6d7175" }}>
                        No data found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Support Grid Footer */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h3">Help center documentation</Text>
                <Text as="p" tone="subdued">Start with our guides and tutorials.</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h3">Contact support</Text>
                <Text as="p" tone="subdued">Got a question or need help? I'm here!</Text>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
