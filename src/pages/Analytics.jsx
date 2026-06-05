import React, { useState } from "react";
import { Page, Layout, Card, Text, BlockStack, Button, InlineStack } from "@shopify/polaris";

export default function Analytics() {
  const [timeframe, setTimeframe] = useState("30"); // 7, 30, 90 days

  return (
    <Page title="Analytics Dashboard">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>📊</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Detailed Store Analytics & Customer Insights
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Deep dive into customer shopping behaviors. Review which products are saved most frequently, track checkouts driven by email alert campaigns, and monitor wishlist page interactions.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Text variant="headingMd" as="h2">Ecosystem Performance Metrics</Text>
        <InlineStack gap="200">
          <Button variant={timeframe === "7" ? "primary" : "secondary"} onClick={() => setTimeframe("7")}>Last 7 Days</Button>
          <Button variant={timeframe === "30" ? "primary" : "secondary"} onClick={() => setTimeframe("30")}>Last 30 Days</Button>
          <Button variant={timeframe === "90" ? "primary" : "secondary"} onClick={() => setTimeframe("90")}>Last 90 Days</Button>
        </InlineStack>
      </div>

      <Layout>
        {/* Mock Chart Container */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" as="h3">Wishlist Activity Over Time</Text>
              
              {/* Premium HTML Chart representation */}
              <div style={{ 
                height: "220px", 
                borderBottom: "2px solid var(--border-color)", 
                borderLeft: "2px solid var(--border-color)",
                marginTop: "20px",
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "0 10px 10px 10px"
              }}>
                {/* Y-Axis Guideline grid */}
                <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.03)", zIndex: 0 }}></div>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.03)", zIndex: 0 }}></div>
                <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.03)", zIndex: 0 }}></div>

                {/* Bars representing daily counts */}
                {[24, 45, 68, 52, 90, 110, 85, 120, 140, 95, 115, 155].map((h, i) => (
                  <div key={i} style={{ 
                    width: "6%", 
                    height: `${(h / 180) * 100}%`, 
                    background: "var(--primary)", 
                    borderRadius: "4px 4px 0 0",
                    position: "relative",
                    cursor: "pointer",
                    transition: "height 0.3s ease",
                    zIndex: 1
                  }}
                  title={`Day ${i + 1}: ${h} adds`}
                  >
                    {/* Hover tooltip simulated */}
                    <div style={{ 
                      display: "none",
                      position: "absolute", 
                      top: "-25px", 
                      left: "50%", 
                      transform: "translateX(-50%)",
                      background: "var(--text-main)",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "9px"
                    }}>{h}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px", fontSize: "11px", color: "var(--text-muted)" }}>
                <span>Start of month</span>
                <span>Mid-month</span>
                <span>End of month</span>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Wishlist conversion funnel metrics */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" as="h3">Conversion Funnel Analysis</Text>

              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span>Add to Wishlist Rate</span>
                    <span style={{ fontWeight: "bold" }}>6.4%</span>
                  </div>
                  <div style={{ width: "100%", background: "var(--bg-app)", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: "75%", background: "var(--primary)", height: "6px", borderRadius: "3px" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span>Email Open Rate</span>
                    <span style={{ fontWeight: "bold" }}>48.2%</span>
                  </div>
                  <div style={{ width: "100%", background: "var(--bg-app)", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: "48%", background: "var(--primary)", height: "6px", borderRadius: "3px" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span>Wishlist Click-Throughs</span>
                    <span style={{ fontWeight: "bold" }}>22.4%</span>
                  </div>
                  <div style={{ width: "100%", background: "var(--bg-app)", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: "22%", background: "var(--primary)", height: "6px", borderRadius: "3px" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                    <span>Checkout Conversion</span>
                    <span style={{ fontWeight: "bold" }}>8.6%</span>
                  </div>
                  <div style={{ width: "100%", background: "var(--bg-app)", height: "6px", borderRadius: "3px" }}>
                    <div style={{ width: "9%", background: "var(--primary)", height: "6px", borderRadius: "3px" }}></div>
                  </div>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
