import React from "react";
import { Page, Layout, Card, Text, BlockStack, Button } from "@shopify/polaris";

export default function Settings() {
  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Wishlist Button & Email Customization
              </Text>
              <Text as="p" tone="subdued">
                Configure colors, styles, and positions of the wishlist button on your theme.
              </Text>
              <div style={{ height: "10px" }}></div>
              <Button variant="primary">Save Configuration</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
