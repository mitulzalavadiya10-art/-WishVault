import React, { useState, useEffect } from "react";
import { Page, Layout, Card, Text, BlockStack, InlineStack, Button, TextField, Select } from "@shopify/polaris";

const PALETTES = [
  { id: "warm-sand",  primary: "#655246", secondary: "#f7f4f0", text: "#332b26", name: "Warm Sand & Espresso (Recommended)", desc: "Muted brown & cream theme" },
  { id: "soft-cocoa", primary: "#8a7968", secondary: "#faf6f0", text: "#4d4138", name: "Soft Cocoa & Milk",                  desc: "Light, highly muted brown palette" },
];

const EMAIL_TEMPLATES = {
  "price-drop":    { subject: "An item in your wishlist has dropped in price!", greeting: "Great news! We noticed a price drop on something you love." },
  "back-in-stock": { subject: "Back in Stock: Grab it before it goes!",         greeting: "Good news! An item on your wishlist is back in stock and ready to ship." },
  "reminder":      { subject: "Your wishlist misses you!",                       greeting: "Here is a quick look at the items waiting for you in your Vault." },
};

// ── Centered success / error modal ───────────────────────────────────────────
function SaveModal({ status, onClose }) {
  if (!status) return null;
  const ok = status === "success";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "40px 36px",
        maxWidth: "400px", width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        animation: "wvFadeUp 0.25s ease",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>{ok ? "✅" : "❌"}</div>
        <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "700", color: ok ? "#2e7d32" : "#c62828" }}>
          {ok ? "Settings Saved!" : "Save Failed"}
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
          {ok
            ? "Your widget customization has been saved. The storefront will reflect changes on next page load."
            : "Something went wrong. Please try again."}
        </p>
        <button onClick={onClose} style={{
          padding: "11px 32px", borderRadius: "8px", border: "none",
          background: ok ? "#655246" : "#c62828", color: "#fff",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>
          {ok ? "Got it!" : "Close"}
        </button>
      </div>
      <style>{`@keyframes wvFadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

export default function Settings({ shop: shopProp }) {
  const resolvedShop = shopProp
    || new URLSearchParams(window.location.search).get("shop")
    || "default-store.myshopify.com";

  const [shop] = useState(resolvedShop);

  // Button config
  const [buttonStyle,    setButtonStyle]    = useState("pill-sand");
  const [buttonText,     setButtonText]     = useState("Add to Wishlist");
  const [primaryColor,   setPrimaryColor]   = useState("#655246");
  const [secondaryColor, setSecondaryColor] = useState("#f7f4f0");
  const [textColor,      setTextColor]      = useState("#332b26");
  const [selectedPalette,setSelectedPalette]= useState("warm-sand");

  // Placement — defaults match "recommended" options
  const [pdpPlacement, setPdpPlacement] = useState("below_cart");
  const [plpPlacement, setPlpPlacement] = useState("top_right");
  const [globalAccess,  setGlobalAccess]  = useState("both");
  const [wishlistView,  setWishlistView]  = useState("drawer");

  // Email
  const [emailTemplate, setEmailTemplate] = useState("price-drop");
  const [emailSubject,  setEmailSubject]  = useState(EMAIL_TEMPLATES["price-drop"].subject);
  const [emailGreeting, setEmailGreeting] = useState(EMAIL_TEMPLATES["price-drop"].greeting);

  // UI
  const [loading,     setLoading]     = useState(false);
  const [modalStatus, setModalStatus] = useState(null);

  // ── Load saved settings ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/settings?shop=${encodeURIComponent(shop)}`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        setButtonStyle(data.buttonStyle    || "pill-sand");
        setButtonText(data.buttonText      || "Add to Wishlist");
        setPrimaryColor(data.primaryColor  || "#655246");
        setSecondaryColor(data.secondaryColor || "#f7f4f0");
        setTextColor(data.textColor        || "#332b26");
        setPdpPlacement(data.pdpPlacement  || "below_cart");
        setPlpPlacement(data.plpPlacement  || "top_right");
        setGlobalAccess(data.globalAccess  || "both");
        setWishlistView(data.wishlistView  || "drawer");
        setEmailSubject(data.emailSubject  || EMAIL_TEMPLATES["price-drop"].subject);
        setEmailGreeting(data.emailGreeting|| EMAIL_TEMPLATES["price-drop"].greeting);
        const matched = PALETTES.find(p => p.primary === data.primaryColor);
        setSelectedPalette(matched ? matched.id : null);
      })
      .catch(err => console.error("Settings load error:", err));
  }, [shop]);

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
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop, primaryColor, secondaryColor, textColor,
        buttonStyle, buttonText, pdpPlacement, plpPlacement,
        globalAccess, wishlistView, emailSubject, emailGreeting,
      }),
    })
      .then(r => r.json())
      .then(data => { setLoading(false); setModalStatus(data.success ? "success" : "error"); })
      .catch(() => { setLoading(false); setModalStatus("error"); });
  };

  return (
    <Page title="Design & Customization">
      <SaveModal status={modalStatus} onClose={() => setModalStatus(null)} />

      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>🎨</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Widget Customization & Alerts Designer
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Tailor the look and feel of the "Add to Wishlist" buttons. Configure email subject headers and templates for automated notifications.
            </p>
          </div>
        </div>
      </div>

      <Layout>
        {/* ── Left column ─────────────────────────────────────────────────── */}
        <Layout.Section>
          <BlockStack gap="500">

            {/* Theme Presets */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2">App Design Theme Presets</Text>
                <Text as="p" tone="subdued">Select a color preset to match your store theme.</Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
                  {PALETTES.map(palette => (
                    <div key={palette.id} onClick={() => applyPalette(palette)} style={{
                      border: selectedPalette === palette.id ? `2px solid ${palette.primary}` : "1px solid #e1e3e5",
                      borderRadius: "8px", padding: "12px", cursor: "pointer",
                      background: selectedPalette === palette.id ? "#fdfcfb" : "#ffffff",
                      transition: "all 0.15s ease",
                    }}>
                      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                        {[palette.primary, palette.secondary, palette.text].map((c, i) => (
                          <span key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, display: "inline-block", border: i === 1 ? "1px solid #e1e3e5" : "none" }} />
                        ))}
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
                <Text as="p" tone="subdued">Select a button style for your product pages.</Text>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {[
                    { id: "pill-sand",     label: "1. Minimalist Sand Pill",
                      preview: <div style={{ marginTop: "8px", padding: "6px 12px", borderRadius: "20px", border: `1px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>♥ {buttonText}</div> },
                    { id: "bold-espresso", label: "2. Bold Espresso Bar",
                      preview: <div style={{ marginTop: "8px", padding: "6px 14px", borderRadius: "6px", background: primaryColor, color: "#fff", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>♥ {buttonText}</div> },
                    { id: "link-only",     label: "3. Understated Link",
                      preview: <div style={{ marginTop: "8px", color: primaryColor, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "500", textDecoration: "underline" }}>♥ {buttonText}</div> },
                    { id: "float-circle",  label: "4. Cozy Floating Heart",
                      preview: <div style={{ marginTop: "8px", width: "32px", height: "32px", borderRadius: "50%", background: secondaryColor, border: `1px solid ${primaryColor}`, color: primaryColor, display: "flex", alignItems: "center", justifyContent: "center" }}>♥</div> },
                  ].map(tpl => (
                    <button key={tpl.id} onClick={() => setButtonStyle(tpl.id)} style={{
                      padding: "12px", borderRadius: "8px", textAlign: "left", cursor: "pointer",
                      border: buttonStyle === tpl.id ? "2px solid #655246" : "1px solid #e1e3e5",
                      background: buttonStyle === tpl.id ? "#faf8f5" : "#fff",
                      transition: "all 0.15s ease",
                    }}>
                      <Text variant="bodySm" fontWeight="bold">{tpl.label}</Text>
                      {tpl.preview}
                    </button>
                  ))}
                </div>

                <TextField label="Button Text" value={buttonText} onChange={setButtonText} autoComplete="off" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Primary Color",  value: primaryColor,   setter: v => { setPrimaryColor(v);   setSelectedPalette(null); } },
                    { label: "Accent / BG",    value: secondaryColor, setter: v => { setSecondaryColor(v); setSelectedPalette(null); } },
                    { label: "Text Contrast",  value: textColor,      setter: v => { setTextColor(v);      setSelectedPalette(null); } },
                  ].map(c => (
                    <div key={c.label}>
                      <label style={{ fontSize: "12px", color: "gray", display: "block", marginBottom: "4px" }}>{c.label}</label>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input type="color" value={c.value} onChange={e => c.setter(e.target.value)}
                          style={{ width: "32px", height: "32px", border: "1px solid #ccc", borderRadius: "4px", padding: 0, cursor: "pointer" }} />
                        <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#555" }}>{c.value}</span>
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
                <Text as="p" tone="subdued">Choose where wishlist buttons appear on your storefront.</Text>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "10px" }}>
                  <Select label="Product Page (PDP) Placement" value={pdpPlacement} onChange={setPdpPlacement} options={[
                    { label: "Below Add to Cart (Recommended)", value: "below_cart" },
                    { label: "Adjacent to Add to Cart",         value: "adjacent_cart" },
                    { label: "Below Product Price",             value: "below_price" },
                  ]} />
                  <Select label="Collection Card (PLP) Placement" value={plpPlacement} onChange={setPlpPlacement} options={[
                    { label: "Top-Right Image Overlay (Recommended)", value: "top_right" },
                    { label: "Top-Left Image Overlay",                value: "top_left" },
                    { label: "Beside Title/Price",                    value: "below_title" },
                    { label: "Hidden (Do not display)",               value: "hidden" },
                  ]} />
                  <Select label="Header & Global Access" value={globalAccess} onChange={setGlobalAccess} options={[
                    { label: "Both Launcher & Header Icon (Recommended)", value: "both" },
                    { label: "Floating Launcher Widget",                  value: "floating_launcher" },
                    { label: "Header Utility Icon Only",                  value: "header_icon" },
                    { label: "None (Manual integration)",                 value: "none" },
                  ]} />
                  <Select label="Wishlist View Layout" value={wishlistView} onChange={setWishlistView} options={[
                    { label: "Slide-out Drawer (Recommended)", value: "drawer" },
                    { label: "Dedicated Proxy Page",           value: "proxy_page" },
                    { label: "Quick Pop-up Modal",             value: "modal" },
                  ]} />
                </div>
              </BlockStack>
            </Card>

            {/* Email Templates */}
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Email Alert Templates</Text>
                <Text as="p" tone="subdued">Customize emails for price drops, restock alerts, and reminders.</Text>
                <InlineStack gap="300">
                  {[
                    { id: "price-drop",    label: "Price Drop Alert" },
                    { id: "back-in-stock", label: "Back in Stock" },
                    { id: "reminder",      label: "Wishlist Reminder" },
                  ].map(tpl => (
                    <Button key={tpl.id} variant={emailTemplate === tpl.id ? "primary" : "secondary"} onClick={() => handleEmailTemplate(tpl.id)}>
                      {tpl.label}
                    </Button>
                  ))}
                </InlineStack>
                <TextField label="Email Subject Line"    value={emailSubject}  onChange={setEmailSubject}  autoComplete="off" />
                <TextField label="Email Header Greeting" value={emailGreeting} onChange={setEmailGreeting} multiline={3} autoComplete="off" />
              </BlockStack>
            </Card>

          </BlockStack>
        </Layout.Section>

        {/* ── Right column: Preview + Save ────────────────────────────────── */}
        <Layout.Section variant="oneThird">
          <BlockStack gap="400">

            {/* Button Preview */}
            <Card>
              <BlockStack gap="300">
                <Text variant="headingSm" as="h3">Wishlist Button Preview</Text>
                <div style={{ padding: "28px 15px", borderRadius: "8px", background: "#fafafa", border: "1px dashed #c9cccf", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "160px", justifyContent: "center" }}>
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{ width: "58px", height: "58px", background: "#e1e3e5", borderRadius: "6px", margin: "0 auto 10px" }} />
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: textColor, marginBottom: "4px" }}>Warm Linen Bedding</div>
                    <div style={{ fontSize: "13px", color: "gray", marginBottom: "14px" }}>$129.00</div>

                    {buttonStyle === "pill-sand" && (
                      <button style={{ padding: "8px 18px", borderRadius: "20px", border: `1.5px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        ♥ {buttonText}
                      </button>
                    )}
                    {buttonStyle === "bold-espresso" && (
                      <button style={{ width: "80%", padding: "10px 16px", borderRadius: "6px", border: "none", background: primaryColor, color: "#fff", fontWeight: "600", fontSize: "13px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        ♥ {buttonText}
                      </button>
                    )}
                    {buttonStyle === "link-only" && (
                      <button style={{ background: "none", border: "none", color: primaryColor, fontWeight: "500", fontSize: "13px", cursor: "pointer", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        ♥ {buttonText}
                      </button>
                    )}
                    {buttonStyle === "float-circle" && (
                      <button style={{ width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.08)", cursor: "pointer", fontSize: "18px" }}>
                        ♥
                      </button>
                    )}
                    {!["pill-sand","bold-espresso","link-only","float-circle"].includes(buttonStyle) && (
                      <button style={{ padding: "8px 18px", borderRadius: "20px", border: `1.5px solid ${primaryColor}`, background: secondaryColor, color: primaryColor, fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
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
                <div style={{ padding: "14px", borderRadius: "8px", background: "#f0ede9", border: "1px solid #dcd7cf", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
                  <div style={{ background: primaryColor, padding: "14px", borderRadius: "6px 6px 0 0", textAlign: "center", color: "#fff" }}>
                    <div style={{ fontSize: "15px", fontWeight: "bold", letterSpacing: "1px" }}>WISHVAULT</div>
                  </div>
                  <div style={{ background: "#fff", padding: "18px 14px", borderRadius: "0 0 6px 6px", textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", fontSize: "12px", color: textColor, marginBottom: "8px" }}>{emailSubject}</div>
                    <div style={{ color: "#80726b", fontSize: "11px", marginBottom: "16px", lineHeight: "1.4" }}>{emailGreeting}</div>
                    <div style={{ margin: "0 auto 12px", padding: "10px", borderRadius: "6px", background: secondaryColor, display: "flex", alignItems: "center", gap: "10px", textAlign: "left", maxWidth: "230px" }}>
                      <div style={{ width: "42px", height: "42px", background: "#e1e3e5", borderRadius: "4px", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "11px" }}>Warm Linen Bedding</div>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                          <span style={{ color: primaryColor, fontWeight: "bold" }}>$109.00</span>
                          {emailTemplate === "price-drop" && <span style={{ textDecoration: "line-through", color: "#b3a59d", fontSize: "10px" }}>$129.00</span>}
                        </div>
                      </div>
                    </div>
                    <button style={{ padding: "7px 18px", background: primaryColor, color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "11px", cursor: "pointer" }}>
                      {emailTemplate === "price-drop" ? "Shop Price Cut" : emailTemplate === "back-in-stock" ? "Buy Now" : "View Vault"}
                    </button>
                  </div>
                </div>
              </BlockStack>
            </Card>

            {/* Save Button */}
            <Button variant="primary" size="large" onClick={handleSave} loading={loading} fullWidth>
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: "4px 0 0" }}>
              Changes apply to storefront on next page load.
            </p>

          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
