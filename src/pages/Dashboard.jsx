import React from "react";
import { Page, Layout, Text, Button } from "@shopify/polaris";

export default function Dashboard() {
  // Mock data for top items
  const topItems = [
    { id: 1, name: "Warm Linen Bedding Set", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=80&q=80", count: 48, price: "$129.00" },
    { id: 2, name: "Minimalist Ceramic Vase", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=80&q=80", count: 35, price: "$45.00" },
    { id: 3, name: "Soy Wax Candle (Sandalwood)", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=80&q=80", count: 29, price: "$24.00" },
  ];

  return (
    <Page>
      {/* Header Section */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "var(--primary)" }}>
            Welcome to WishVault
          </h1>
          <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "14px" }}>
            Here's how your wishlists and alerts are performing today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="secondary">View Live Store</Button>
          <Button variant="primary" style={{ backgroundColor: "var(--primary)", borderColor: "var(--primary)" }}>
            Customize Widget
          </Button>
        </div>
      </div>

      <Layout>
        {/* Setup Guide Banner */}
        <Layout.Section>
          <div className="card" style={{ padding: "1.75rem", borderLeft: "5px solid var(--primary)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <span style={{ 
                  background: "var(--border-color)", 
                  color: "var(--primary)", 
                  padding: "4px 10px", 
                  borderRadius: "20px", 
                  fontSize: "11px", 
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Quick Start Guide
                </span>
                <h3 style={{ margin: "10px 0 5px", fontSize: "18px", fontWeight: "600", color: "var(--text-main)" }}>
                  Activate Wishlist Widget & Setup
                </h3>
                <p style={{ margin: "0 0 15px 0", color: "var(--text-muted)", fontSize: "13.5px" }}>
                  Complete the setup to enable the floating wishlist button and price alert widgets on your online store.
                </p>
              </div>
              <div style={{ color: "var(--primary)", fontWeight: "600", fontSize: "14px" }}>
                1 / 4 Completed
              </div>
            </div>

            {/* Custom Premium Progress Bar */}
            <div style={{ width: "100%", background: "var(--border-color)", height: "8px", borderRadius: "10px", overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ width: "25%", background: "var(--primary)", height: "8px", borderRadius: "10px", transition: "width 0.5s ease" }}></div>
            </div>

            {/* Step list */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#4caf50", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>✓</span>
                <span style={{ fontSize: "13px", color: "var(--text-main)", fontWeight: "500" }}>Enable App Embed</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--border-color)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>2</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Verify Button Position</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--border-color)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>3</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Customize Alert Template</span>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--border-color)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>4</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Test Price Drop Email</span>
              </div>
            </div>
          </div>
        </Layout.Section>

        {/* 8 Stats Metrics Grid (Styled with custom icons, clean sizes, premium cards) */}
        <Layout.Section>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginTop: "10px"
          }}>
            {[
              { label: "Wishlist Page Views", value: "1,248", icon: "👁️", trend: "+12% this week" },
              { label: "Customers with Wishlist", value: "384", icon: "👤", trend: "+8% this week" },
              { label: "Total Wishlists Created", value: "412", icon: "✨", trend: "+15% this week" },
              { label: "Unique Products Wishlisted", value: "87", icon: "📦", trend: "+4% this week" },
              { label: "Added to Cart from Wishlist", value: "94", icon: "🛒", trend: "+20% this week" },
              { label: "Orders from Wishlist", value: "32", icon: "🛍️", trend: "+18% this week" },
              { label: "Average Order Value", value: "$114.50", icon: "💳", trend: "+2.4% vs last mo" },
              { label: "Wishlist Revenue Generated", value: "$3,664.00", icon: "🤎", trend: "+14.8% vs last mo" }
            ].map((stat, i) => (
              <div key={i} className="card" style={{ padding: "1.5rem", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-muted)" }}>{stat.label}</span>
                  <span style={{ fontSize: "20px", background: "var(--bg-app)", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{stat.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)" }}>{stat.value}</div>
                  <div style={{ fontSize: "11.5px", color: "#4caf50", fontWeight: "500", marginTop: "4px" }}>{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </Layout.Section>

        {/* Top 10 Table & Wishlist Limit Warning */}
        <Layout.Section variant="oneThird">
          <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "17px", fontWeight: "600", color: "var(--text-main)" }}>Wishlist Usage Limits</h3>
              <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "13px" }}>
                Under your current Free Plan, you have 100 free wishlist additions per month.
              </p>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", fontWeight: "600", marginBottom: "8px" }}>
                <span>48 / 100 Additions</span>
                <span style={{ color: "var(--primary)" }}>48% Used</span>
              </div>
              <div style={{ width: "100%", background: "var(--border-color)", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "25px" }}>
                <div style={{ width: "48%", background: "var(--primary)", height: "8px", borderRadius: "4px" }}></div>
              </div>
            </div>

            <div style={{ padding: "12px", background: "var(--bg-app)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: "12.5px", fontWeight: "600", color: "var(--text-main)", marginBottom: "4px" }}>Need higher limits?</div>
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "10px" }}>Upgrade to Pro Vault for unlimited wishlists & advanced email alert flows.</div>
              <Button size="slim" style={{ backgroundColor: "var(--primary)", color: "white", border: "none" }}>Upgrade Now</Button>
            </div>
          </div>
        </Layout.Section>

        <Layout.Section>
          <div className="card" style={{ padding: "1.75rem" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "600", color: "var(--text-main)" }}>
              Top Wishlisted Items in Your Store
            </h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ padding: "12px 10px", textAlign: "left", fontSize: "12.5px", fontWeight: "600", color: "var(--text-muted)" }}>Product Details</th>
                    <th style={{ padding: "12px 10px", textAlign: "center", fontSize: "12.5px", fontWeight: "600", color: "var(--text-muted)" }}>Price</th>
                    <th style={{ padding: "12px 10px", textAlign: "right", fontSize: "12.5px", fontWeight: "600", color: "var(--text-muted)" }}>Wishlists Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={item.id} style={{ borderBottom: index === topItems.length - 1 ? "none" : "1px solid var(--border-color)" }}>
                      <td style={{ padding: "14px 10px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={item.image} alt={item.name} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                        <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-main)" }}>{item.name}</span>
                      </td>
                      <td style={{ padding: "14px 10px", textAlign: "center", fontSize: "13.5px", color: "var(--text-muted)" }}>{item.price}</td>
                      <td style={{ padding: "14px 10px", textAlign: "right", fontWeight: "700", fontSize: "14px", color: "var(--primary)" }}>{item.count} times</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Layout.Section>

        {/* Support Grid Footer */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div className="card" style={{ display: "flex", gap: "15px", alignItems: "flex-start", padding: "1.5rem" }}>
              <span style={{ fontSize: "24px" }}>📚</span>
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>Help Center & Documentation</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "var(--text-muted)" }}>Learn how to insert wishlist buttons, configure alert flows, and target customers.</p>
                <a href="#docs" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>Read Setup Docs →</a>
              </div>
            </div>
            <div className="card" style={{ display: "flex", gap: "15px", alignItems: "flex-start", padding: "1.5rem" }}>
              <span style={{ fontSize: "24px" }}>💌</span>
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>Contact Partner Support</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "12.5px", color: "var(--text-muted)" }}>Have questions, feature requests, or custom integration needs? We are here for you.</p>
                <a href="mailto:support@wishvault.co" style={{ color: "var(--primary)", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>Email Support →</a>
              </div>
            </div>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
