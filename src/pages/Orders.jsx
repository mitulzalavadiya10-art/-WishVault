import React from "react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function Orders() {
  // Mock orders attributed to wishlist email alert notifications
  const mockOrders = [
    { id: "1008", customer: "Sophia Miller", product: "Warm Linen Bedding Set", price: "$129.00", status: "Paid", date: "2026-06-05", source: "Price Drop Alert" },
    { id: "1005", customer: "Liam Davis", product: "Minimalist Ceramic Vase", price: "$45.00", status: "Paid", date: "2026-06-04", source: "Back In Stock Alert" },
    { id: "1002", customer: "Olivia Johnson", product: "Soy Wax Candle (Sandalwood)", price: "$24.00", status: "Paid", date: "2026-06-02", source: "Wishlist Reminder Digest" },
  ];

  return (
    <Page title="Wishlist Orders">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>🛍️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Wishlist-Attributed Orders & Sales Attribution
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Track checkouts and purchases that resulted directly from automated wishlist emails. You can see which campaign (Price Drop, Restock, or Reminder) drove the sale.
            </p>
          </div>
        </div>
      </div>

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingSm" as="h3">Attributed Orders Log</Text>
              
              <div style={{ overflowX: "auto", marginTop: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
                      <th style={{ padding: "10px", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Order ID</th>
                      <th style={{ padding: "10px", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Customer</th>
                      <th style={{ padding: "10px", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Purchased Product</th>
                      <th style={{ padding: "10px", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Order Total</th>
                      <th style={{ padding: "10px", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Campaign Source</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12.5px", color: "var(--text-muted)", fontWeight: "600" }}>Purchase Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "700", color: "var(--text-main)" }}>#{order.id}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13.5px", fontWeight: "600" }}>{order.customer}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>{order.product}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13.5px", fontWeight: "700", color: "var(--primary)" }}>{order.price}</td>
                        <td style={{ padding: "12px 10px", fontSize: "13px" }}>
                          <span style={{ background: "var(--border-color)", color: "var(--primary)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
                            {order.source}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
