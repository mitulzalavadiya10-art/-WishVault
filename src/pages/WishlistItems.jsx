import React from "react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function WishlistItems() {
  return (
    <Page title="Wishlisted Items">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                All Wishlisted Items
              </Text>
              <Text as="p" tone="subdued">
                Here you can view and manage all the products that your customers have added to their wishlists.
              </Text>
              <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", border: "1px dashed #c9cccf", borderRadius: "8px" }}>
                <Text tone="subdued" as="p">
                  No wishlisted items found yet. Once customers start adding products to their wishlist, they will show up here.
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
