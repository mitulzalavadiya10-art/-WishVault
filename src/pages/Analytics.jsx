import React from "react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function Analytics() {
  return (
    <Page title="Analytics Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Detailed Store Analytics
              </Text>
              <Text as="p" tone="subdued">
                Track how wishlists are performing, view most wanted products, and see search patterns.
              </Text>
              <div style={{ padding: "40px", textAlign: "center", background: "#f9fafb", border: "1px dashed #c9cccf", borderRadius: "8px" }}>
                <Text tone="subdued" as="p">
                  Analytics will start showing statistics once store activity begins.
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
