import React from "react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function Orders() {
  return (
    <Page title="Wishlist Orders">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Wishlist-Attributed Orders
              </Text>
              <Text as="p" tone="subdued">
                Monitor sales and checkouts that resulted directly from customer wishlist reminders and alert notifications.
              </Text>
              <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", border: "1px dashed #c9cccf", borderRadius: "8px" }}>
                <Text tone="subdued" as="p">
                  No orders converted from wishlists yet.
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
