import React, { useState } from "react";

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState("espresso");

  return (
    <div style={{
      background: "var(--bg-app)",
      minHeight: "100vh",
      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      color: "var(--text-main)",
      margin: 0,
      padding: 0
    }}>
      {/* Header / Navbar */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 5%",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "var(--primary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px"
          }}>
            V
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)", letterSpacing: "-0.5px" }}>
            WishVault
          </span>
        </div>
        <div style={{ display: "flex", gap: "25px", fontSize: "14px", fontWeight: "500" }}>
          <a href="#features" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Features</a>
          <a href="#templates" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Templates</a>
          <a href="#pricing" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Pricing</a>
        </div>
        <a 
          href="https://admin.shopify.com"
          style={{
            background: "var(--primary)",
            color: "white",
            padding: "8px 18px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          Install App
        </a>
      </nav>

      {/* Hero Section */}
      <header style={{
        maxWidth: "1200px",
        margin: "4rem auto 2rem",
        padding: "0 5%",
        textAlign: "center"
      }}>
        <span style={{
          background: "var(--accent-light)44",
          color: "var(--primary)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "12.5px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          display: "inline-block",
          marginBottom: "1.5rem"
        }}>
          ✨ Elevate Your Shopify Store Experience
        </span>
        <h1 style={{
          fontSize: "52px",
          fontWeight: "800",
          lineHeight: "1.15",
          color: "var(--text-main)",
          maxWidth: "800px",
          margin: "0 auto 1.5rem",
          letterSpacing: "-1.5px"
        }}>
          The Premium Wishlist & Alerts App for Modern Brands
        </h1>
        <p style={{
          fontSize: "18px",
          color: "var(--text-muted)",
          maxWidth: "600px",
          margin: "0 auto 2rem",
          lineHeight: "1.6"
        }}>
          Add a beautiful, high-conversion wishlist widget and automated email alert system styled with warm, earthy aesthetics. Keep your customers coming back.
        </p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "4rem" }}>
          <a 
            href="https://admin.shopify.com"
            style={{
              background: "var(--primary)",
              color: "white",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "var(--shadow-md)"
            }}
          >
            Start For Free
          </a>
          <a 
            href="#templates"
            style={{
              background: "white",
              color: "var(--primary)",
              border: "1px solid var(--border-color)",
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              textDecoration: "none"
            }}
          >
            View Demo Templates
          </a>
        </div>
      </header>

      {/* Live Template Showcase Section */}
      <section id="templates" style={{
        maxWidth: "1000px",
        margin: "0 auto 5rem",
        padding: "0 5%"
      }}>
        <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "24px", fontWeight: "700" }}>
            Custom Widget Templates Showcase
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>
            Choose from beautiful preset button styles matching your boutique store's aesthetics.
          </p>

          {/* Template Selectors */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "2rem" }}>
            {[
              { id: "espresso", name: "Warm Espresso" },
              { id: "sand", name: "Soft Sand" },
              { id: "minimal", name: "Understated Link" }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  background: activeTemplate === t.id ? "var(--primary)" : "var(--border-color)",
                  color: activeTemplate === t.id ? "white" : "var(--text-main)",
                  transition: "all 0.2s ease"
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Interactive Mock Product Card */}
          <div style={{
            maxWidth: "320px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            padding: "1.5rem",
            boxShadow: "var(--shadow-sm)",
            textAlign: "left"
          }}>
            <div style={{
              width: "100%",
              height: "220px",
              background: "#eae5df",
              borderRadius: "8px",
              marginBottom: "1rem",
              position: "relative",
              overflow: "hidden"
            }}>
              <span style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "white",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                fontSize: "14px",
                color: "var(--primary)",
                cursor: "pointer"
              }}>
                ♥
              </span>
            </div>
            
            <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "600" }}>Organic Linen Pillowcase</h3>
            <p style={{ margin: "0 0 1rem 0", color: "var(--text-muted)", fontSize: "13px" }}>Set of 2 • Muted Cream</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: "700" }}>$48.00</span>
              
              {/* Dynamic Wishlist Button Template Preview */}
              {activeTemplate === "espresso" && (
                <button style={{
                  padding: "8px 14px",
                  background: "#655246",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  Add to Wishlist
                </button>
              )}

              {activeTemplate === "sand" && (
                <button style={{
                  padding: "8px 14px",
                  background: "#faf6f0",
                  color: "#655246",
                  border: "1px solid #655246",
                  borderRadius: "20px",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}>
                  ♥ Save Item
                </button>
              )}

              {activeTemplate === "minimal" && (
                <button style={{
                  background: "none",
                  border: "none",
                  color: "#655246",
                  fontSize: "12.5px",
                  fontWeight: "600",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}>
                  Save to Vault
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{
        maxWidth: "1200px",
        margin: "0 auto 5rem",
        padding: "0 5%"
      }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "700", marginBottom: "3rem" }}>
          Everything you need for wishlist conversion
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <span style={{ fontSize: "28px" }}>🎨</span>
            <h3 style={{ margin: "15px 0 10px", fontSize: "18px", fontWeight: "600" }}>Earthy Design Customizer</h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Configure and preview widgets easily in our warm-sand dashboard, designed specifically for minimalist boutique brands.
            </p>
          </div>
          <div className="card" style={{ padding: "2rem" }}>
            <span style={{ fontSize: "28px" }}>✉️</span>
            <h3 style={{ margin: "15px 0 10px", fontSize: "18px", fontWeight: "600" }}>Price Drop Alerts</h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Automatically notify customers when items in their wishlist go on sale. Drive repeat traffic effortlessly.
            </p>
          </div>
          <div className="card" style={{ padding: "2rem" }}>
            <span style={{ fontSize: "28px" }}>📊</span>
            <h3 style={{ margin: "15px 0 10px", fontSize: "18px", fontWeight: "600" }}>Detailed Analytics</h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Track wishlist add rates, customer click-throughs, most wanted items, and generated revenue in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        maxWidth: "900px",
        margin: "0 auto 6rem",
        padding: "0 5%"
      }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "700", marginBottom: "3rem" }}>
          Simple, Transparent Plans
        </h2>

        <div style={{ display: "flex", gap: "20px", flexDirection: "row", flexWrap: "wrap" }}>
          <div className="card" style={{ flex: 1, minWidth: "280px", padding: "2.5rem 2rem", background: "white" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Free Plan</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", margin: "15px 0", color: "var(--primary)" }}>Free</div>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Perfect for starting shops exploring wishlists.</p>
            <ul style={{ paddingLeft: "20px", fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "2rem" }}>
              <li>Up to 100 wishlist additions / mo</li>
              <li>Fully customizable widget</li>
              <li>Standard layout templates</li>
            </ul>
            <a 
              href="https://admin.shopify.com"
              style={{
                display: "block",
                textAlign: "center",
                background: "var(--border-color)",
                color: "var(--text-main)",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Get Started
            </a>
          </div>

          <div className="card" style={{ flex: 1, minWidth: "280px", padding: "2.5rem 2rem", border: "2px solid var(--primary)", background: "white" }}>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Pro Vault</h3>
            <div style={{ fontSize: "32px", fontWeight: "800", margin: "15px 0", color: "var(--primary)" }}>$9.99<span style={{ fontSize: "14px", fontWeight: "400" }}>/mo</span></div>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "1.5rem" }}>For growing stores looking to scale alerts and conversion.</p>
            <ul style={{ paddingLeft: "20px", fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.8", marginBottom: "2rem" }}>
              <li><strong>Unlimited</strong> wishlist additions</li>
              <li>Automated Price Drop & Restock Emails</li>
              <li>Complete Analytics + CSV Exports</li>
              <li>Priority support integration</li>
            </ul>
            <a 
              href="https://admin.shopify.com"
              style={{
                display: "block",
                textAlign: "center",
                background: "var(--primary)",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "600",
                textDecoration: "none",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              Upgrade to Pro
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "white",
        borderTop: "1px solid var(--border-color)",
        padding: "2.5rem 5%",
        textAlign: "center",
        fontSize: "13.5px",
        color: "var(--text-muted)"
      }}>
        <p style={{ margin: 0 }}>© 2026 WishVault. Designed elegantly with muted earth tones.</p>
      </footer>
    </div>
  );
}
