import React, { useState, useEffect } from "react";
import { Page, Card, Text, Banner } from "@shopify/polaris";

export default function WishlistItems({ shop }) {
  const resolvedShop = shop || new URLSearchParams(window.location.search).get("shop") || "default-store.myshopify.com";
  const [activeTab, setActiveTab] = useState("product"); // product, user, unsubscriber, mail
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMsg, setBannerMsg] = useState("");

  // Live Database States
  const [wishlistItems, setWishlistItems] = useState([]);
  const [unsubscriberList, setUnsubscriberList] = useState([]);
  const [mailHistory, setMailHistory] = useState([]);

  // Fetch Database tables on mount and when tab changes
  const fetchData = () => {
    fetch(`/api/wishlist?shop=${encodeURIComponent(resolvedShop)}`)
      .then(res => res.json())
      .then(data => setWishlistItems(data || []))
      .catch(err => console.error("Error fetching wishlists:", err));

    fetch(`/api/unsubscriber?shop=${encodeURIComponent(resolvedShop)}`)
      .then(res => res.json())
      .then(data => setUnsubscriberList(data || []))
      .catch(err => console.error("Error fetching unsubscribers:", err));

    fetch(`/api/mail-history?shop=${encodeURIComponent(resolvedShop)}`)
      .then(res => res.json())
      .then(data => setMailHistory(data || []))
      .catch(err => console.error("Error fetching mail history:", err));
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Aggregate Product Wishlist counts from raw wishlist items
  const getProductWishlist = () => {
    const productCountsMap = {};
    wishlistItems.forEach(item => {
      const pId = item.productId;
      if (!productCountsMap[pId]) {
        productCountsMap[pId] = {
          id: pId,
          name: item.productTitle || "Product",
          price: item.productPrice || "$0.00",
          image: item.productImage || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=50&q=50",
          count: 0
        };
      }
      productCountsMap[pId].count++;
    });
    return Object.values(productCountsMap);
  };

  // Aggregate User list from raw wishlist items
  const getUserWishlist = () => {
    const userMap = {};
    wishlistItems.forEach(item => {
      const email = item.customerEmail || "Guest User";
      if (!userMap[email]) {
        userMap[email] = {
          id: item.id,
          name: item.customerId ? `Customer #${item.customerId}` : "Guest Shopper",
          email: email,
          itemsCount: 0,
          lastUpdated: new Date(item.createdAt).toLocaleDateString()
        };
      }
      userMap[email].itemsCount++;
    });
    return Object.values(userMap);
  };

  // Export CSV Handler
  const handleExport = () => {
    if (wishlistItems.length === 0) {
      setBannerMsg("No data available to export.");
      setShowBanner(true);
      return;
    }
    const headers = "CustomerEmail,ProductId,ProductTitle,ProductPrice,ProductImage,CreatedAt\n";
    const rows = wishlistItems.map(item => 
      `"${item.customerEmail || ""}","${item.productId}","${item.productTitle || ""}","${item.productPrice || ""}","${item.productImage || ""}","${item.createdAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `wishvault-export-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  // Import CSV Handler
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      fetch("/api/wishlist/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setBannerMsg(`Successfully imported ${data.count} wishlist items!`);
            setShowBanner(true);
            fetchData();
          }
        })
        .catch(err => {
          console.error("Error importing CSV:", err);
          setBannerMsg("Failed to import CSV. Check file formatting.");
          setShowBanner(true);
        });
    };
    reader.readAsText(file);
  };

  // Dynamic search and sorting logic
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase().trim();

    if (activeTab === "product") {
      let list = getProductWishlist().filter(item => item.name.toLowerCase().includes(query));
      if (filterBy === "high-to-low") list.sort((a, b) => b.count - a.count);
      if (filterBy === "low-to-high") list.sort((a, b) => a.count - b.count);
      return list;
    }

    if (activeTab === "user") {
      return getUserWishlist().filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.email.toLowerCase().includes(query)
      );
    }

    if (activeTab === "unsubscriber") {
      return unsubscriberList.filter(item => item.email.toLowerCase().includes(query));
    }

    if (activeTab === "mail") {
      return mailHistory.filter(item => 
        item.email.toLowerCase().includes(query) || 
        item.subject.toLowerCase().includes(query)
      );
    }

    return [];
  };

  const filteredData = getFilteredData();

  return (
    <Page>
      {/* Page Intro Banner */}
      <div className="page-intro-banner">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "24px" }}>📋</span>
          <div>
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "var(--text-main)" }}>
              Wishlist & Lead Management Database
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.4" }}>
              Search, filter, and audit customer wishlist items. You can import legacy data lists from previous apps via CSV uploads, export your contacts list for marketing re-engagement, and see who unsubscribed from price drop notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Banner Status Notifier */}
      {showBanner && (
        <div style={{ marginBottom: "15px" }}>
          <Banner title={bannerMsg} onDismiss={() => setShowBanner(false)} tone="info" />
        </div>
      )}

      {/* Title & Top Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "var(--text-main)" }}>
          Wishlist
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* CSV File Input Styled trigger */}
          <label style={{
            background: "var(--bg-app)",
            border: "1px solid var(--border-color)",
            borderRadius: "6px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-main)"
          }}>
            📥 Import CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleImport} 
              style={{ display: "none" }} 
            />
          </label>

          <button 
            onClick={handleExport}
            style={{
              background: "var(--bg-app)",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-main)"
            }}
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      <Card>
        {/* Sub-Navigation Tabs */}
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          borderBottom: "1px solid var(--border-color)", 
          paddingBottom: "12px", 
          marginBottom: "15px",
          overflowX: "auto"
        }}>
          {[
            { id: "product", label: "Product wishlist" },
            { id: "user", label: "User wishlist" },
            { id: "unsubscriber", label: "Unsubscriber list" },
            { id: "mail", label: "Wishlist mail history" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              style={{
                background: activeTab === tab.id ? "var(--bg-app)" : "transparent",
                border: activeTab === tab.id ? "1px solid var(--border-color)" : "none",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? "600" : "500",
                color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              outline: "none",
              fontSize: "14px",
              color: "var(--text-main)",
              background: "#ffffff"
            }}
          />

          {activeTab === "product" && (
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "#ffffff",
                fontSize: "13.5px",
                color: "var(--text-main)",
                cursor: "pointer"
              }}
            >
              <option value="all">Filter By</option>
              <option value="high-to-low">Highest Count</option>
              <option value="low-to-high">Lowest Count</option>
            </select>
          )}

          <button style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "13.5px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)"
          }}>
            Search
          </button>
        </div>

        {/* Dynamic Table Header Label */}
        <div style={{ marginBottom: "15px" }}>
          <Text variant="headingSm" as="h3">
            {activeTab === "product" && "Product Wishlist"}
            {activeTab === "user" && "User Wishlist"}
            {activeTab === "unsubscriber" && "Unsubscriber List"}
            {activeTab === "mail" && "Wishlist Mail History"}
          </Text>
        </div>

        {/* Dynamic Table Content */}
        {filteredData.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--border-color)", textAlign: "left" }}>
                  {activeTab === "product" && (
                    <>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Product</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)" }}>Wishlist Count</th>
                    </>
                  )}
                  {activeTab === "user" && (
                    <>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Customer</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Email</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Total Items</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)" }}>Last Updated</th>
                    </>
                  )}
                  {activeTab === "unsubscriber" && (
                    <>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Email Address</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)" }}>Unsubscribed On</th>
                    </>
                  )}
                  {activeTab === "mail" && (
                    <>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Recipient</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Subject</th>
                      <th style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)" }}>Alert Type</th>
                      <th style={{ padding: "10px", textAlign: "right", fontSize: "12px", color: "var(--text-muted)" }}>Sent Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === "product" && filteredData.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <img src={item.image} alt={item.name} style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "13.5px", color: "var(--text-main)" }}>{item.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.price}</div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right", fontWeight: "700", color: "var(--primary)", fontSize: "13.5px" }}>
                      {item.count}
                    </td>
                  </tr>
                ))}

                {activeTab === "user" && filteredData.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 10px", fontWeight: "600", fontSize: "13.5px", color: "var(--text-main)" }}>{item.name}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>{item.email}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>{item.itemsCount} items</td>
                    <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>{item.lastUpdated}</td>
                  </tr>
                ))}

                {activeTab === "unsubscriber" && filteredData.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 10px", fontSize: "13.5px", color: "var(--text-main)" }}>{item.email}</td>
                    <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {activeTab === "mail" && filteredData.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "12px 10px", fontSize: "13.5px", color: "var(--text-main)" }}>{item.email}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px", color: "var(--text-muted)" }}>{item.subject}</td>
                    <td style={{ padding: "12px 10px", fontSize: "13px" }}>
                      <span style={{ background: "var(--border-color)", color: "var(--primary)", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right", fontSize: "13px", color: "var(--text-muted)" }}>
                      {new Date(item.sentAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            marginTop: "10px",
            padding: "40px",
            textAlign: "center",
            background: "var(--bg-app)",
            border: "1px solid var(--border-color)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            fontSize: "13.5px"
          }}>
            No data found
          </div>
        )}
      </Card>
    </Page>
  );
}
