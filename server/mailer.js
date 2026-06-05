import nodemailer from "nodemailer";

/**
 * Sends a premium styled HTML email using configured SMTP or Ethereal test accounts.
 */
export async function sendEmail({ to, subject, html }) {
  try {
    let transporter;

    // Use SMTP configuration if available in environment variables
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Create a test account on Ethereal.email for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: '"WishVault Alerts" <alerts@wishvault.co>',
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    // If using test Ethereal account, log the test viewer URL
    if (info.messageId && info.messageId.includes("ethereal")) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[Email Simulated] Sent to: ${to}`);
      console.log(`[Preview Inbox URL]: ${previewUrl}`);
      return { success: true, messageId: info.messageId, previewUrl };
    }

    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
