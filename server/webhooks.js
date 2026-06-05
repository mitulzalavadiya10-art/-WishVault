import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./mailer.js";

const prisma = new PrismaClient();

/**
 * Helper to verify Shopify webhook HMAC signature.
 */
export function verifyShopifyWebhook(req, apiSecret) {
  const hmacHeader = req.get("X-Shopify-Hmac-SHA256");
  if (!hmacHeader) return false;

  const rawBody = req.rawBody || req.body;
  const hash = crypto
    .createHmac("sha256", apiSecret)
    .update(rawBody)
    .digest("base64");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

/**
 * Handle incoming products/update webhook.
 */
export async function handleProductUpdateWebhook(shop, productData) {
  try {
    const productId = String(productData.id);
    const variants = productData.variants || [];
    if (variants.length === 0) return;

    // We assume the first variant represents the main product price/inventory for simplicity
    const firstVariant = variants[0];
    const newPriceVal = parseFloat(firstVariant.price);
    const isAvailable = firstVariant.inventory_quantity > 0;

    // 1. Fetch all wishlist entries matching this product and shop
    const wishlistEntries = await prisma.wishlist.findMany({
      where: { shop, productId },
    });

    if (wishlistEntries.length === 0) return;

    // Fetch settings for custom email templates
    let settings = await prisma.appSettings.findUnique({
      where: { shop },
    });
    if (!settings) {
      settings = {
        primaryColor: "#655246",
        secondaryColor: "#f7f4f0",
        textColor: "#332b26",
        emailSubject: "An item in your wishlist has dropped in price!",
        emailGreeting: "Great news! We noticed a price drop on something you love.",
      };
    }

    // Fetch unsubscribers to avoid sending alerts to opted-out emails
    const unsubscribed = await prisma.unsubscriber.findMany({
      where: { shop },
      select: { email: true },
    });
    const unsubscribedEmails = new Set(unsubscribed.map(u => u.email.toLowerCase()));

    for (const entry of wishlistEntries) {
      const email = entry.customerEmail;
      if (!email || unsubscribedEmails.has(email.toLowerCase())) continue;

      // Extract original price
      const cleanOldPrice = entry.productPrice ? parseFloat(entry.productPrice.replace(/[^0-9.]/g, "")) : 0;

      // Condition A: Price Drop Detection (New price is lower by at least 1 unit)
      if (cleanOldPrice > 0 && newPriceVal < cleanOldPrice) {
        const subject = settings.emailSubject;
        const html = `
          <div style="font-family: Arial, sans-serif; background-color: ${settings.secondaryColor}; padding: 30px; color: ${settings.textColor}; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
              <h2 style="color: ${settings.primaryColor}; margin-top: 0;">WISHVAULT</h2>
              <h3 style="margin-bottom: 15px;">${subject}</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #666;">${settings.emailGreeting}</p>
              
              <!-- Product info -->
              <div style="display: flex; gap: 15px; align-items: center; border: 1px solid #eee; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: left;">
                ${entry.productImage ? `<img src="${entry.productImage}" alt="${entry.productTitle}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ""}
                <div>
                  <h4 style="margin: 0; font-size: 15px;">${entry.productTitle}</h4>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: ${settings.primaryColor}; font-weight: bold;">
                    New Price: $${newPriceVal.toFixed(2)} <span style="text-decoration: line-through; color: #aaa; font-size: 11px; font-weight: normal; margin-left: 5px;">$${cleanOldPrice.toFixed(2)}</span>
                  </p>
                </div>
              </div>
              
              <a href="https://${shop}/products/${productData.handle || ''}" style="background-color: ${settings.primaryColor}; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 13px;">
                Shop Discount Now
              </a>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 11px; color: #999; margin: 0;">
                If you wish to stop receiving these notifications, click here to <a href="https://wish-vault-flame.vercel.app/api/unsubscribe?email=${encodeURIComponent(email)}&shop=${shop}" style="color: ${settings.primaryColor}; text-decoration: underline;">unsubscribe</a>.
              </p>
            </div>
          </div>
        `;

        // Send actual email
        try {
          const result = await sendEmail({ to: email, subject, html });
          // Log to MailHistory
          await prisma.mailHistory.create({
            data: {
              shop,
              email,
              subject,
              type: "Price Drop",
              status: "Sent",
            },
          });

          // Update cached price in wishlist to prevent repeating the same discount alert
          await prisma.wishlist.update({
            where: { id: entry.id },
            data: { productPrice: `$${newPriceVal.toFixed(2)}` },
          });
        } catch (emailErr) {
          console.error("Failed to send price drop email alert:", emailErr);
          await prisma.mailHistory.create({
            data: {
              shop,
              email,
              subject,
              type: "Price Drop",
              status: "Failed",
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("Error processing product update webhook:", err);
  }
}
