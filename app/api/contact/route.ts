import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isValidEmail } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const {
      name = "",
      email = "",
      company = "",
      projectType = "UI/UX Design",
      budget = "Not specified",
      message = "",
      botcheck = "",
    } = body;

    // 1. Honeypot check for bots
    if (botcheck) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    // 2. Strict server-side field validations
    const errors: Record<string, string> = {};

    const cleanName = String(name).trim().slice(0, 100);
    const cleanEmail = String(email).trim().slice(0, 120);
    const cleanCompany = String(company).trim().slice(0, 120);
    const cleanMessage = String(message).trim().slice(0, 3000);
    const cleanProjectType = String(projectType).trim().slice(0, 100);
    const cleanBudget = String(budget).trim().slice(0, 100);

    if (!cleanName || cleanName.length < 2) {
      errors.name = "Please enter your name (at least 2 characters).";
    }

    if (!cleanEmail) {
      errors.email = "Please enter your work email address.";
    } else if (!isValidEmail(cleanEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    if (!cleanMessage) {
      errors.message = "Please describe your project goals and requirements.";
    } else if (cleanMessage.length < 10) {
      errors.message = "Project overview must be at least 10 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the errors in the form.",
          errors,
        },
        { status: 400 }
      );
    }

    // Recipient email
    const recipientEmail =
      process.env.ADMIN_INQUIRY_EMAIL || "marslanprofessional@gmail.com";

    // 3. Automated email dispatch via Nodemailer (Gmail / SMTP)
    const gmailAppPassword =
      process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
    const smtpUser =
      process.env.SMTP_USER || "marslanprofessional@gmail.com";
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    // Check for Formspree endpoint option
    const formspreeId =
      process.env.FORMSPREE_ID || process.env.NEXT_PUBLIC_FORMSPREE_ID;

    let emailDelivered = false;
    let deliveryMethod = "none";
    let deliveryError = "";

    if (gmailAppPassword) {
      try {
        const transporter = smtpHost
          ? nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: {
                user: smtpUser,
                pass: gmailAppPassword,
              },
            })
          : nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: smtpUser,
                pass: gmailAppPassword.replace(/\s+/g, ""), // Remove spaces in 16-char app passwords
              },
            });

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0d; color: #ffffff; padding: 20px; }
    .card { background-color: #16161b; border: 1px solid #26262e; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; }
    .tag { display: inline-block; background-color: #d7ff3f; color: #000000; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 20px; }
    h2 { margin: 0 0 16px; font-size: 24px; color: #ffffff; }
    .item { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #888899; margin-bottom: 4px; }
    .value { font-size: 15px; color: #ffffff; font-weight: 500; }
    .message-box { background-color: #0e0e11; border: 1px solid #222228; border-radius: 8px; padding: 16px; margin-top: 20px; font-size: 14px; line-height: 1.6; color: #e0e0e0; white-space: pre-wrap; }
    .footer { margin-top: 24px; font-size: 12px; color: #666677; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">New Project Lead · Portfolio</div>
    <h2>Project Inquiry from ${cleanName}</h2>
    
    <div class="item">
      <div class="label">Client Name</div>
      <div class="value">${cleanName}</div>
    </div>

    <div class="item">
      <div class="label">Work Email</div>
      <div class="value"><a href="mailto:${cleanEmail}" style="color: #00f0ff;">${cleanEmail}</a></div>
    </div>

    <div class="item">
      <div class="label">Company / Website</div>
      <div class="value">${cleanCompany || "Not specified"}</div>
    </div>

    <div class="item">
      <div class="label">Project Scope</div>
      <div class="value">${cleanProjectType}</div>
    </div>

    <div class="item">
      <div class="label">Investment Budget</div>
      <div class="value">${cleanBudget}</div>
    </div>

    <div class="item">
      <div class="label">Project Brief &amp; Goals</div>
      <div class="message-box">${cleanMessage}</div>
    </div>

    <div class="footer">
      Sent directly from Muhammad Arslan Portfolio Contact Engine. Reply directly to this email to respond to ${cleanName}.
    </div>
  </div>
</body>
</html>
        `;

        await transporter.sendMail({
          from: `"Portfolio Inquiries" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: cleanEmail,
          subject: `✨ New Inquiry: ${cleanName} — ${cleanProjectType} (${cleanBudget})`,
          text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nCompany: ${cleanCompany || "N/A"}\nProject: ${cleanProjectType}\nBudget: ${cleanBudget}\n\nMessage:\n${cleanMessage}`,
          html: htmlContent,
        });

        emailDelivered = true;
        deliveryMethod = "smtp";
      } catch (err: any) {
        console.error("SMTP delivery failed:", err?.message);
        deliveryError = err?.message || "Failed to deliver via SMTP";
      }
    } else if (formspreeId) {
      try {
        const formspreeRes = await fetch(
          `https://formspree.io/f/${formspreeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              company: cleanCompany,
              projectType: cleanProjectType,
              budget: cleanBudget,
              message: cleanMessage,
            }),
          }
        );

        if (formspreeRes.ok) {
          emailDelivered = true;
          deliveryMethod = "formspree";
        }
      } catch (err: any) {
        console.error("Formspree delivery error:", err?.message);
        deliveryError = err?.message || "Formspree request failed";
      }
    } else {
      // Default zero-config delivery gateway via FormSubmit to recipientEmail
      try {
        const rawOrigin = req.headers.get("origin") || req.headers.get("referer") || "https://www.muhammadarslan.com";
        let cleanOrigin = "https://www.muhammadarslan.com";
        try {
          cleanOrigin = new URL(rawOrigin).origin;
        } catch {
          cleanOrigin = "https://www.muhammadarslan.com";
        }

        const formSubmitRes = await fetch(
          `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Origin: cleanOrigin,
              Referer: `${cleanOrigin}/contact`,
            },
            body: JSON.stringify({
              name: cleanName,
              email: cleanEmail,
              company: cleanCompany || "Not specified",
              _subject: `✨ New Inquiry from ${cleanName} — ${cleanProjectType}`,
              "Project Scope": cleanProjectType,
              "Investment Budget": cleanBudget,
              "Project Brief": cleanMessage,
            }),
          }
        );

        const fsData = await formSubmitRes.json().catch(() => null);

        if (fsData?.success === "true" || fsData?.success === true) {
          emailDelivered = true;
          deliveryMethod = "formsubmit";
        } else if (fsData?.message && fsData.message.includes("Activation")) {
          // One-time activation required by FormSubmit
          deliveryMethod = "formsubmit-activation-needed";
          deliveryError = fsData.message;
        } else {
          deliveryError = fsData?.message || "Delivery service error";
        }
      } catch (err: any) {
        console.error("FormSubmit delivery error:", err?.message);
        deliveryError = err?.message || "Automated email forwarding failed";
      }
    }

    return NextResponse.json({
      success: true,
      delivered: emailDelivered,
      method: deliveryMethod,
      error: deliveryError || undefined,
      recipient: recipientEmail,
      summary: {
        name: cleanName,
        email: cleanEmail,
        projectType: cleanProjectType,
      },
    });
  } catch (error: any) {
    console.error("Contact API internal error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal error occurred while processing your inquiry.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
