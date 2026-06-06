import React, { useState, useEffect } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, TextField, Banner, Select } from "@shopify/polaris";

export default function Settings() {
  const [shop, setShop] = useState("default-store.myshopify.com");
  
  // Wishlist Button Configuration States
  const [buttonStyle, setButtonStyle] = useState("pill-sand");
  const [buttonText, setButtonText] = useState("Add to Wishlist");
  const [primaryColor, setPrimaryColor] = useState("#655246");
  const [secondaryColor, setSecondaryColor] = useState("#f7f4f0");
  const [textColor, setTextColor] = useState("#332b26");
  const [isSaved, setIsSaved] = useState(false);

  // Placement States
  const [pdpPlacement, setPdpPlacement] = useState("below_cart");
  const [plpPlacement, setPlpPlacement] = useState("top_right");
  const [globalAccess, setGlobalAccess] = useState("floating_launcher");
  const [wishlistView, setWishlistView] = useState("proxy_page");

  // Email Alert Configuration States
  const [emailTemplate, setEmailTemplate] = useState("price-drop");
  const [emailSubject, setEmailSubject] = useState("An item in your wishlist has dropped in price!");
  const [emailGreeting, setEmailGreeting] = useState("Great news! We noticed a price drop on something you love.");

  // Fetch settings on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shopParam = params.get("shop") || "default-store.myshopify.com";
    setShop(shopParam);

    fetch(`/api/settings?shop=${shopParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setButtonStyle(data.buttonStyle);
          setButtonText(data.buttonText);
          setPrimaryColor(data.primaryColor);
          setSecondaryColor(data.secondaryColor);
          setTextColor(data.textColor);
          setPdpPlacement(data.pdpPlacement || "below_cart");
          setPlpPlacement(data.plpPlacement || "top_right");
          setGlobalAccess(data.globalAccess || "floating_launcher");
          setWishlistView(data.wishlistView || "proxy_page");
          setEmailSubject(data.emailSubject);
          setEmailGreeting(data.emailGreeting);
        }
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const handleSave = () => {
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop,
        primaryColor,
        secondaryColor,
        textColor,
        buttonStyle,
        buttonText,
        pdpPlacement,
        plpPlacement,
        globalAccess,
        wishlistView,
        emailSubject,
        emailGreeting
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsSaved(true);
          alert("Settings saved successfully!"); // Immediate popup confirmation toast
          setTimeout(() => setIsSaved(false), 3000);
        } else {
          alert("Failed to save settings: " + (data.error || "Unknown error"));
        }
      })
      .catch((err) => {
        console.error("Error saving settings:", err);
        alert("Error saving settings: " + err.message);
      });
  };

  const applyPalette = (primary, secondary, text) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
    setTextColor(text);
  };

  return (
    <Page title="Design & Customization">
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>🎨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Widget Customization & Alerts Designer
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Tailor the look and feel of the "Add to Wishlist" buttons to blend with your storefront's brand guidelines. Configure custom email subject headers and template parameters for automated notifications.
            </p>
          </div>
        </div>
      </div>

      {isSaved && (
        <div style={{ marginBottom: "15px" }}>
          <Banner title="Settings saved successfully!" tone="success" />
        </div>
      )}

      <Layout>
        {/* Left column: Theme Settings & Styles */}
        <Layout.Section>
          <BlockStack gap="500">
            {/* Template Presets */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">App Design Theme Presets</Text>
                <Text as="p" tone="subdued">
                  Select a color preset designed to match your theme. We recommend using our soft, muted brown and sand tones to keep your store looking clean and premium.
                </Text>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
                  <div 
                    onClick={() => applyPalette("#655246", "#f7f4f0", "#332b26")}
                    style={{
                      border: primaryColor === "#655246" ? "2px solid #655246" : "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      background: "#ffffff"
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#655246" }}></span>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f7f4f0", border: "1px solid #e1e3e5" }}></span>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#332b26" }}></span>
                    </div>
                    <Text variant="bodySm" fontWeight="bold">Warm Sand & Espresso (Recommended)</Text>
                    <Text variant="bodyXs" tone="subdued">Muted brown & cream theme</Text>
                  </div>

                  <div 
                    onClick={() => applyPalette("#8a7968", "#faf6f0", "#4d4138")}
                    style={{
                      border: primaryColor === "#8a7968" ? "2px solid #8a7968" : "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      background: "#ffffff"
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#8a7968" }}></span>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#faf6f0", border: "1px solid #e1e3e5" }}></span>
                      <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#4d4138" }}></span>
                    </div>
                    <Text variant="bodySm" fontWeight="bold">Soft Cocoa & Milk</Text>
                    <Text variant="bodyXs" tone="subdued">Light, highly muted brown palette</Text>
                  </div>
                </div>
              </BlockStack>
            </Card>

            {/* Wishlist Button Customizer */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Wishlist Button Templates</Text>
                
                <Text as="p" tone="subdued">
                  Select a template layout for the button that appears on your product pages.
                </Text>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  <button 
                    onClick={() => setButtonStyle("pill-sand")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: buttonStyle === "pill-sand" ? "2px solid var(--primary)" : "1px solid #e1e3e5",
                      background: buttonStyle === "pill-sand" ? "var(--bg-app)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <Text variant="bodySm" fontWeight="bold">1. Minimalist Sand Pill</Text>
                    <div style={{
                      marginTop: "8px",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: `1px solid ${primaryColor}`,
                      background: secondaryColor,
                      color: primaryColor,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px"
                    }}>
                      <span>♥</span> {buttonText}
                    </div>
                  </button>

                  <button 
                    onClick={() => setButtonStyle("bold-espresso")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: buttonStyle === "bold-espresso" ? "2px solid var(--primary)" : "1px solid #e1e3e5",
                      background: buttonStyle === "bold-espresso" ? "var(--bg-app)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <Text variant="bodySm" fontWeight="bold">2. Bold Espresso Bar</Text>
                    <div style={{
                      marginTop: "8px",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      background: primaryColor,
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px"
                    }}>
                      <span>♥</span> {buttonText}
                    </div>
                  </button>

                  <button 
                    onClick={() => setButtonStyle("link-only")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: buttonStyle === "link-only" ? "2px solid var(--primary)" : "1px solid #e1e3e5",
                      background: buttonStyle === "link-only" ? "var(--bg-app)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <Text variant="bodySm" fontWeight="bold">3. Understated Link</Text>
                    <div style={{
                      marginTop: "8px",
                      color: primaryColor,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: "500",
                      textDecoration: "underline"
                    }}>
                      <span>♥</span> {buttonText}
                    </div>
                  </button>

                  <button 
                    onClick={() => setButtonStyle("float-circle")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: buttonStyle === "float-circle" ? "2px solid var(--primary)" : "1px solid #e1e3e5",
                      background: buttonStyle === "float-circle" ? "var(--bg-app)" : "#fff",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    <Text variant="bodySm" fontWeight="bold">4. Cozy Floating Heart</Text>
                    <div style={{
                      marginTop: "8px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: secondaryColor,
                      border: `1px solid ${primaryColor}`,
                      color: primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                    }}>
                      <span>♥</span>
                    </div>
                  </button>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <TextField
                    label="Button Text"
                    value={buttonText}
                    onChange={(val) => setButtonText(val)}
                    autoComplete="off"
                  />
                </div>

                {/* Color customization */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "gray", display: "block", marginBottom: "4px" }}>Primary (Muted Brown)</label>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        style={{ width: "30px", height: "30px", border: "1px solid #ccc", borderRadius: "4px", padding: 0, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "gray", display: "block", marginBottom: "4px" }}>Accent/BG (Sand/Cream)</label>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                      <input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        style={{ width: "30px", height: "30px", border: "1px solid #ccc", borderRadius: "4px", padding: 0, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{secondaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "gray", display: "block", marginBottom: "4px" }}>Text Contrast</label>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                      <input 
                        type="color" 
                        value={textColor} 
                        onChange={(e) => setTextColor(e.target.value)}
                        style={{ width: "30px", height: "30px", border: "1px solid #ccc", borderRadius: "4px", padding: 0, cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{textColor}</span>
                    </div>
                  </div>
                </div>

              </BlockStack>
            </Card>

            {/* Wishlist Placement & Layout Settings */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Button Placement & Layout Settings</Text>
                <Text as="p" tone="subdued">
                  Choose where the "Add to Wishlist" buttons appear on your storefront and configure your global access points.
                </Text>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "10px" }}>
                  <Select
                    label="Product Page (PDP) Placement"
                    options={[
                      { label: "Below Add to Cart (Recommended)", value: "below_cart" },
                      { label: "Adjacent to Add to Cart", value: "adjacent_cart" },
                      { label: "Below Product Price", value: "below_price" },
                    ]}
                    value={pdpPlacement}
                    onChange={(val) => setPdpPlacement(val)}
                  />

                  <Select
                    label="Collection Card (PLP) Placement"
                    options={[
                      { label: "Top-Right Image Overlay (Recommended)", value: "top_right" },
                      { label: "Top-Left Image Overlay", value: "top_left" },
                      { label: "Beside Title/Price", value: "below_title" },
                      { label: "Hidden (Do not display)", value: "hidden" },
                    ]}
                    value={plpPlacement}
                    onChange={(val) => setPlpPlacement(val)}
                  />

                  <Select
                    label="Header & Global Access"
                    options={[
                      { label: "Floating Launcher Widget (Recommended)", value: "floating_launcher" },
                      { label: "Header Utility Icon", value: "header_icon" },
                      { label: "Both Launcher & Header Icon", value: "both" },
                      { label: "None (Manual integration)", value: "none" },
                    ]}
                    value={globalAccess}
                    onChange={(val) => setGlobalAccess(val)}
                  />

                  <Select
                    label="Wishlist View Layout"
                    options={[
                      { label: "Dedicated Proxy Page (Recommended)", value: "proxy_page" },
                      { label: "Slide-out Drawer", value: "drawer" },
                      { label: "Quick Pop-up Modal", value: "modal" },
                    ]}
                    value={wishlistView}
                    onChange={(val) => setWishlistView(val)}
                  />
                </div>
              </BlockStack>
            </Card>

            {/* Email Templates Selector */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Email Alert Templates</Text>
                <Text as="p" tone="subdued">
                  Customize templates for emails sent to customers when product prices drop or when items come back in stock.
                </Text>

                <InlineStack gap="300">
                  <Button 
                    variant={emailTemplate === "price-drop" ? "primary" : "secondary"}
                    onClick={() => {
                      setEmailTemplate("price-drop");
                      setEmailSubject("An item in your wishlist has dropped in price!");
                      setEmailGreeting("Great news! We noticed a price drop on something you love.");
                    }}
                  >
                    Price Drop Alert
                  </Button>
                  <Button 
                    variant={emailTemplate === "back-in-stock" ? "primary" : "secondary"}
                    onClick={() => {
                      setEmailTemplate("back-in-stock");
                      setEmailSubject("Back in Stock: Grab it before it goes!");
                      setEmailGreeting("Good news! An item on your wishlist is back in stock and ready to ship.");
                    }}
                  >
                    Back in Stock
                  </Button>
                  <Button 
                    variant={emailTemplate === "reminder" ? "primary" : "secondary"}
                    onClick={() => {
                      setEmailTemplate("reminder");
                      setEmailSubject("Your wishlist misses you!");
                      setEmailGreeting("Here is a quick look at the items waiting for you in your Vault.");
                    }}
                  >
                    Wishlist Reminder
                  </Button>
                </InlineStack>

                <TextField
                  label="Email Subject Line"
                  value={emailSubject}
                  onChange={(val) => setEmailSubject(val)}
                  autoComplete="off"
                />

                <TextField
                  label="Email Header Greeting"
                  value={emailGreeting}
                  onChange={(val) => setEmailGreeting(val)}
                  multiline={3}
                  autoComplete="off"
                />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Right column: Real-time Live Desktop/Mobile Preview */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">
            {/* Live Button Preview Card */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Wishlist Button Preview</Text>
                
                <div style={{
                  padding: "30px 15px",
                  borderRadius: "8px",
                  background: "#fafafa",
                  border: "1px dashed #c9cccf",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "150px"
                }}>
                  {/* Mock Product Page Container */}
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ width: "60px", height: "60px", background: "#e1e3e5", borderRadius: "6px", margin: "0 auto 10px" }}></div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: textColor, marginBottom: "4px" }}>Warm Linen Bedding</div>
                    <div style={{ fontSize: "13px", color: "gray", marginBottom: "15px" }}>$129.00</div>

                    {/* Dynamic Template Rendering */}
                    {buttonStyle === "pill-sand" && (
                      <button style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: `1.5px solid ${primaryColor}`,
                        background: secondaryColor,
                        color: primaryColor,
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <span style={{ color: primaryColor }}>♥</span>
                        {buttonText}
                      </button>
                    )}

                    {buttonStyle === "bold-espresso" && (
                      <button style={{
                        width: "80%",
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: primaryColor,
                        color: "#ffffff",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}>
                        <span>♥</span>
                        {buttonText}
                      </button>
                    )}

                    {buttonStyle === "link-only" && (
                      <button style={{
                        background: "none",
                        border: "none",
                        color: primaryColor,
                        fontWeight: "500",
                        fontSize: "13px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}>
                        <span>♥</span>
                        {buttonText}
                      </button>
                    )}

                    {buttonStyle === "float-circle" && (
                      <button style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: `1px solid ${primaryColor}`,
                        background: secondaryColor,
                        color: primaryColor,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        cursor: "pointer"
                      }}>
                        <span style={{ fontSize: "16px" }}>♥</span>
                      </button>
                    )}
                  </div>
                </div>
              </BlockStack>
            </Card>

            {/* Live Email Preview Card */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Email Alert Mockup</Text>
                
                <div style={{
                  padding: "15px",
                  borderRadius: "8px",
                  background: "#f0ede9",
                  border: "1px solid #dcd7cf",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  color: "#332b26"
                }}>
                  {/* Email Header */}
                  <div style={{
                    background: primaryColor,
                    padding: "16px",
                    borderRadius: "6px 6px 0 0",
                    textAlign: "center",
                    color: "#ffffff"
                  }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>WISHVAULT</div>
                  </div>

                  {/* Email Body */}
                  <div style={{
                    background: "#ffffff",
                    padding: "20px 15px",
                    borderRadius: "0 0 6px 6px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontWeight: "bold", fontSize: "13px", color: textColor, marginBottom: "10px" }}>
                      {emailSubject}
                    </div>
                    <div style={{ color: "#80726b", fontSize: "11px", marginBottom: "20px", lineHeight: "1.4" }}>
                      {emailGreeting}
                    </div>

                    {/* Product Mock */}
                    <div style={{
                      margin: "15px auto",
                      padding: "10px",
                      borderRadius: "6px",
                      background: secondaryColor,
                      border: `1px solid ${primaryColor}1a`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      textAlign: "left",
                      maxWidth: "240px"
                    }}>
                      <div style={{ width: "45px", height: "45px", background: "#e1e3e5", borderRadius: "4px", flexShrink: 0 }}></div>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "11px" }}>Warm Linen Bedding</div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ color: primaryColor, fontWeight: "bold" }}>$109.00</span>
                          {emailTemplate === "price-drop" && (
                            <span style={{ textDecoration: "line-through", color: "#b3a59d", fontSize: "10px" }}>$129.00</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Call to Action Button */}
                    <button style={{
                      marginTop: "10px",
                      padding: "8px 20px",
                      background: primaryColor,
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      fontSize: "11px",
                      cursor: "pointer"
                    }}>
                      {emailTemplate === "price-drop" ? "Shop Price Cut" : emailTemplate === "back-in-stock" ? "Buy Now" : "View Vault"}
                    </button>
                  </div>
                </div>
              </BlockStack>
            </Card>

            <Button variant="primary" size="large" onClick={handleSave} fullWidth>
              Save Configuration
            </Button>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
