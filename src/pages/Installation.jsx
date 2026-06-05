import React from "react";
import { Page, Layout, Card, Text, BlockStack } from "@shopify/polaris";

export default function Installation() {
  return (
    <Page title="Theme Installation">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Setup Widget in Online Store
              </Text>
              <Text as="p" tone="subdued">
                Follow this simple step to add the wishlist heart button onto your product page template.
              </Text>
              <div style={{ padding: "15px", background: "#f1f2f3", borderRadius: "8px" }}>
                <pre style={{ margin: 0, fontSize: "13px" }}>
                  <code>{`<div class="wishvault-button" data-product="{{ product.id }}"></div>`}</code>
                </pre>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
