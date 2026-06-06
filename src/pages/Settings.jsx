import React, { useState, useEffect } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, TextField, Banner, Select } from "@shopify/polaris";

const PALETTES = [
  { id: "warm-sand", primary: "#655246", secondary: "#f7f4f0", text: "#332b26", name: "Warm Sand & Espresso (Recommended)", desc: "Muted brown & cream theme" },
  { id: "soft-cocoa", primary: "#8a7968", secondary: "#faf6f0", text: "#4d4138", name: "Soft Cocoa & Milk", desc: "Light, highly muted brown palette" },
];

const EMAIL_TEMPLATES = {
  "price-drop": {
    subject: "An item in your wishlist has dropped in price!",
    greeting: "Great news! We noticed a price drop on something you love.",
  },
  "back-in-stock": {
    subject: "Back in Stock: Grab it before it goes!",
    greeting: "Good news! An item on your wishlist is back in stock and ready to ship.",
  },
  "reminder": {
    subject: "Your wishlist misses you!",
    greeting: "Here is a quick look at the items waiting for you in your Vault.",
  },
};

export default function Settings() {
  const [shop, setShop] = useState("default-store.myshopify.com");

  // Button config
  const [buttonStyle, setButtonStyle] = useState("pill-sand");
  const [buttonText, setButtonText] = useState("Add to Wishlist");
  const [primaryColor, setPrimaryColor] = useState("#655246");
  const [secondaryColor, setSecondaryColor] = useState("#f7f4f0");
  const [textColor, setTextColor] = useState("#332b26");
  const [selectedPalette, setSelectedPalette] = useState("warm-sand");

  // Placement
  const [pdpPlacement, setPdpPlacement] = useState("below_cart");
  const [plpPlacement, setPlpPlacement] = useState("top_right");
  const [globalAccess, setGlobalAccess] = useState("floating_launcher");
  const [wishlistView, setWishlistView] = useState("proxy_page");

  // Email
  const [emailTemplate, setEmailTemplate] = useState("price-drop");
  const [emailSubject, setEmailSubject] = useState(EMAIL_TEMPLATES["price-drop"].subject);
  const [emailGreeting, setEmailGreeting] = useState(EMAIL_TEMPLATES["price-drop"].greeting);

  // UI state
  const [saveStatus, setSaveStatus] = useState(null); // null | "success" | "error"
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shopParam = params.get("shop") || "default-store.myshopify.com";
    setShop(shopParam);

    fetch(`/api/settings?shop=${shopParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;

        setButtonStyle(data.buttonStyle || "pill-sand");
        setButtonText(data.buttonText || "Add to Wishlist");
        setPrimaryColor(data.primaryColor || "#655246");
        setSecondaryColor(data.secondaryColor || "#f7f4f0");
        setTextColor(data.textColor || "#332b26");
        setPdpPlacement(data.pdpPlacement || "below_cart");
        setPlpPlacement(data.plpPlacement || "top_right");
        setGlobalAccess(data.globalAccess || "floating_launcher");
        setWishlistView(data.wishlistView || "proxy_page");
        setEmailSubject(data.emailSubject || EMAIL_TEMPLATES["price-drop"].subject);
        setEmailGreeting(data.emailGreeting || EMAIL_TEMPLATES["price-drop"].greeting);

        // Detect which palette matches loaded colors
        const matched = PALETTES.find(p => p.primary === data.primaryColor);
        if (matched) setSelectedPalette(matched.id);
        else setSelectedPalette(null); // custom color — no preset selected
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const applyPalette = (palette) => {
    setSelectedPalette(palette.id);
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setTextColor(palette.text);
  };

  const handleEmailTemplate = (tpl) => {
    setEmailTemplate(tpl);
    setEmailSubject(EMAIL_TEMPLATES[tpl].subject);
    setEmailGreeting(EMAIL_TEMPLATES[tpl].greeting);
  };

  const handleSave = () => {
    setLoading(true);
    setSaveStatus(null);

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
        emailGreeting,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setSaveStatus("success");
          setTimeout(() => setSaveStatus(null), 3000);
        } else {
          setSaveStatus("error");
          setSaveError(data.error || "Unknown error");
        }
      })
      .catch((err) => {
        setLoading(false);
        setSaveStatus("error");
        setSaveError(err.message);
      });
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

      {saveStatus === "success" && (
        <div style={{ marginBottom: "15px" }}>
          <Banner title="Settings saved successfully!" tone="success" onDismiss={() => setSaveStatus(null)} />
        </div>
      )}
      {saveStatus === "error" && (
        <div style={{ marginBottom: "15px" }}>
          <Banner title={`Failed to save settings: ${saveError}`} tone="critical" onDismiss={() => setSaveStatus(null)} />
        </div>
      )}

      <Layout>
        {/* Left column */}
        <Layout.Section>
          <BlockStack gap="500">

            {/* Theme Presets */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">App Design Theme Presets</Text>
                <Text as="p" tone="subdued">
                  Select a color preset designed to match your theme. We recommend our soft, muted brown and sand tones.
                </Text>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
                  {PALETTES.map((palette) => (
                    <div
                      key={palette.id}
                      onClick={() => applyPalette(palette)}
                      style={{
                        border: selectedPalette === palette.id ? `2px solid ${palette.primary}` : "1px solid #e1e3e5",
                        borderRadius: "8px",
                        padding: "12px",
                        cursor: "pointer",
                        background: selectedPalette === palette.id ? "#fdfcfb" : "#ffffff",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: palette.primary, display: "inline-block" }}></span>
                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: palette.secondary, border: "1px solid #e1e3e5", display: "inline-block" }}></span>
                        <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: palette.text, display: "inline-block" }}></span>
                      </div>
                      <Text variant="bodySm" fontWeight="bold">{palette.name}</Text>
                      <Text variant="bodyXs" tone="subdued">{palette.desc}</Text>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </Card>

            {/* Button Templates */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Wishlist Button Templates</Text>
                <Text as="p" tone="subdued">
                  Select a template layout for the button that appears on your product pages.
                </Text>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {[
                    {
                      id: "pill-sand",
                      label: "1. Minimalist Sand Pill",
                      preview: (
                        <div style={{ marginTop: "8px", padding: "6px 12px", borderRadius: "20px", border: `1px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                          <span>♥</span> {buttonText}
                        </div>
                      ),
                    },
                    {
                      id: "bold-espresso",
                      label: "2. Bold Espresso Bar",
                      preview: (
                        <div style={{ marginTop: "8px", padding: "6px 14px", borderRadius: "6px", background: primaryColor, color: "#fff", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                          <span>♥</span> {buttonText}
                        </div>
                      ),
                    },
                    {
                      id: "link-only",
                      label: "3. Understated Link",
                      preview: (
                        <div style={{ marginTop: "8px", color: primaryColor, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "500", textDecoration: "underline" }}>
                          <span>♥</span> {buttonText}
                        </div>
                      ),
                    },
                    {
                      id: "float-circle",
                      label: "4. Cozy Floating Heart",
                      preview: (
                        <div style={{ marginTop: "8px", width: "32px", height: "32px", borderRadius: "50%", background: secondaryColor, border: `1px solid ${primaryColor}`, color: primaryColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                          <span>♥</span>
                        </div>
                      ),
                    },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setButtonStyle(tpl.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: buttonStyle === tpl.id ? "2px solid var(--primary, #655246)" : "1px solid #e1e3e5",
                        background: buttonStyle === tpl.id ? "var(--bg-app, #faf8f5)" : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Text variant="bodySm" fontWeight="bold">{tpl.label}</Text>
                      {tpl.preview}
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <TextField
                    label="Button Text"
                    value={buttonText}
                    onChange={(val) => setButtonText(val)}
                    autoComplete="off"
                  />
                </div>

                {/* Color pickers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Primary (Muted Brown)", value: primaryColor, setter: (v) => { setPrimaryColor(v); setSelectedPalette(null); } },
                    { label: "Accent/BG (Sand/Cream)", value: secondaryColor, setter: (v) => { setSecondaryColor(v); setSelectedPalette(null); } },
                    { label: "Text Contrast", value: textColor, setter: (v) => { setTextColor(v); setSelectedPalette(null); } },
                  ].map((c) => (
                    <div key={c.label}>
                      <label style={{ fontSize: "12px", color: "gray", display: "block", marginBottom: "4px" }}>{c.label}</label>
                      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                        <input
                          type="color"
                          value={c.value}
                          onChange={(e) => c.setter(e.target.value)}
                          style={{ width: "30px", height: "30px", border: "1px solid #ccc", borderRadius: "4px", padding: 0, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: "11px", fontFamily: "monospace" }}>{c.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </BlockStack>
            </Card>

            {/* Placement Settings */}
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
                    onChange={setPdpPlacement}
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
                    onChange={setPlpPlacement}
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
                    onChange={setGlobalAccess}
                  />
                  <Select
                    label="Wishlist View Layout"
                    options={[
                      { label: "Dedicated Proxy Page (Recommended)", value: "proxy_page" },
                      { label: "Slide-out Drawer", value: "drawer" },
                      { label: "Quick Pop-up Modal", value: "modal" },
                    ]}
                    value={wishlistView}
                    onChange={setWishlistView}
                  />
                </div>
              </BlockStack>
            </Card>

            {/* Email Templates */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Email Alert Templates</Text>
                <Text as="p" tone="subdued">
                  Customize templates for emails sent to customers when product prices drop or when items come back in stock.
                </Text>

                <InlineStack gap="300">
                  {[
                    { id: "price-drop", label: "Price Drop Alert" },
                    { id: "back-in-stock", label: "Back in Stock" },
                    { id: "reminder", label: "Wishlist Reminder" },
                  ].map((tpl) => (
                    <Button
                      key={tpl.id}
                      variant={emailTemplate === tpl.id ? "primary" : "secondary"}
                      onClick={() => handleEmailTemplate(tpl.id)}
                    >
                      {tpl.label}
                    </Button>
                  ))}
                </InlineStack>

                <TextField
                  label="Email Subject Line"
                  value={emailSubject}
                  onChange={setEmailSubject}
                  autoComplete="off"
                />
                <TextField
                  label="Email Header Greeting"
                  value={emailGreeting}
                  onChange={setEmailGreeting}
                  multiline={3}
                  autoComplete="off"
                />
              </BlockStack>
            </Card>

          </BlockStack>
        </Layout.Section>

        {/* Right column: Preview */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">

            {/* Button Preview */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Wishlist Button Preview</Text>
                <div style={{ padding: "30px 15px", borderRadius: "8px", background: "#fafafa", border: "1px dashed #c9cccf", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "150px" }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ width: "60px", height: "60px", background: "#e1e3e5", borderRadius: "6px", margin: "0 auto 10px" }}></div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: textColor, marginBottom: "4px" }}>Warm Linen Bedding</div>
                    <div style={{ fontSize: "13px", color: "gray", marginBottom: "15px" }}>$129.00</div>

                    {buttonStyle === "pill-sand" && (
                      <button style={{ padding: "8px 16px", borderRadius: "20px", border: `1.5px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span>♥</span> {buttonText}
                      </button>
                    )}
                    {buttonStyle === "bold-espresso" && (
                      <button style={{ width: "80%", padding: "10px 16px", borderRadius: "6px", border: "none", background: primaryColor, color: "#ffffff", fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <span>♥</span> {buttonText}
                      </button>
                    )}
                    {buttonStyle === "link-only" && (
                      <button style={{ background: "none", border: "none", color: primaryColor, fontWeight: "500", fontSize: "13px", cursor: "pointer", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span>♥</span> {buttonText}
                      </button>
                    )}
                    {buttonStyle === "float-circle" && (
                      <button style={{ width: "42px", height: "42px", borderRadius: "50%", border: `1px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", cursor: "pointer" }}>
                        <span style={{ fontSize: "16px" }}>♥</span>
                      </button>
                    )}
                    {/* Fallback if somehow no style matched */}
                    {!["pill-sand", "bold-espresso", "link-only", "float-circle"].includes(buttonStyle) && (
                      <button style={{ padding: "8px 16px", borderRadius: "20px", border: `1.5px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                        ♥ {buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </BlockStack>
            </Card>

            {/* Email Preview */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Email Alert Mockup</Text>
                <div style={{ padding: "15px", borderRadius: "8px", background: "#f0ede9", border: "1px solid #dcd7cf", fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#332b26" }}>
                  <div style={{ background: primaryColor, padding: "16px", borderRadius: "6px 6px 0 0", textAlign: "center", color: "#ffffff" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>WISHVAULT</div>
                  </div>
                  <div style={{ background: "#ffffff", padding: "20px 15px", borderRadius: "0 0 6px 6px", textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", fontSize: "13px", color: textColor, marginBottom: "10px" }}>{emailSubject}</div>
                    <div style={{ color: "#80726b", fontSize: "11px", marginBottom: "20px", lineHeight: "1.4" }}>{emailGreeting}</div>
                    <div style={{ margin: "15px auto", padding: "10px", borderRadius: "6px", background: secondaryColor, border: `1px solid ${primaryColor}1a`, display: "flex", alignItems: "center", gap: "10px", textAlign: "left", maxWidth: "240px" }}>
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
                    <button style={{ marginTop: "10px", padding: "8px 20px", background: primaryColor, color: "#ffffff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>
                      {emailTemplate === "price-drop" ? "Shop Price Cut" : emailTemplate === "back-in-stock" ? "Buy Now" : "View Vault"}
                    </button>
                  </div>
                </div>
              </BlockStack>
            </Card>

            <Button variant="primary" size="large" onClick={handleSave} loading={loading} fullWidth>
              Save Configuration
            </Button>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
