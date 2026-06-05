import React from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button } from "@shopify/polaris";

export default function Dashboard() {
  return (
    <Page>
      {/* Title & Subtitle */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "var(--text-main)" }}>
          Hello
        </h1>
        <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "14px" }}>
          It's so good to see you here.
        </p>
      </div>

      <Layout>
        {/* Active app blocks & Setup Guide */}
        <Layout.Section>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text variant="headingMd" as="h2">
                Active app blocks & Setup Guide
              </Text>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button style={{
                  background: "var(--bg-app)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <span style={{ fontSize: "12px" }}>👁️</span> View details
                </button>
                <button style={{
                  background: "none",
                  border: "none",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px"
                }}>
                  ✕
                </button>
              </div>
            </div>

            <div style={{ marginTop: "10px", marginBottom: "15px" }}>
              <Text as="p" tone="subdued" variant="bodySm">
                0 / 4 completed
              </Text>
            </div>

            {/* Custom progress bar */}
            <div style={{ width: "100%", background: "var(--border-color)", height: "8px", borderRadius: "4px" }}>
              <div style={{ width: "0%", background: "var(--primary)", height: "8px", borderRadius: "4px" }}></div>
            </div>
          </Card>
        </Layout.Section>

        {/* Wishlist addition limits */}
        <Layout.Section>
          <Text variant="bodySm" as="p" tone="subdued">
            0/ 100 Wishlist additions
          </Text>
          <div style={{ width: "100%", background: "var(--border-color)", height: "4px", borderRadius: "2px", marginTop: "5px" }}>
            <div style={{ width: "0%", background: "var(--primary)", height: "4px", borderRadius: "2px" }}></div>
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
            {[
              { label: "Wishlist page views", value: "0", icon: "👁️" },
              { label: "Customers with wishlist", value: "0", icon: "👤" },
              { label: "Total wishlists", value: "0", icon: "♡" },
              { label: "Unique products wishlisted", value: "0", icon: "🏷️" },
              { label: "Added to cart from wishlist", value: "0", icon: "🛒" },
              { label: "Orders from wishlist", value: "0", icon: "📥" },
              { label: "Average Order Value", value: "$0.00", icon: "📈" },
              { label: "Revenue from Wishlist", value: "$0.00", icon: "🪙" }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-muted)" }}>{stat.label}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>{stat.icon}</span>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </Layout.Section>

        {/* Top 10 items in public wishlists */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">Top 10 items in public wishlists</Text>
              
              <div style={{ marginTop: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                      <th style={{ padding: "8px 0", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Product</th>
                      <th style={{ padding: "8px 0", textAlign: "right", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Wishlist Count</th>
                    </tr>
                  </thead>
                </table>
                <div style={{
                  marginTop: "10px",
                  padding: "30px",
                  textAlign: "center",
                  background: "var(--bg-app)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-muted)",
                  fontSize: "13px"
                }}>
                  No data found
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Support Grid Footer */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "18px", color: "var(--primary)" }}>📖</span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13.5px", color: "var(--text-main)" }}>Help center documentation</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Start with our guides and tutorials.</div>
                </div>
              </div>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>🔍</span>
            </div>

            <div className="card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "18px", color: "var(--primary)" }}>✉️</span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13.5px", color: "var(--text-main)" }}>Contact support</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Got a question or need help? I'm here!</div>
                </div>
              </div>
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>➔</span>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
