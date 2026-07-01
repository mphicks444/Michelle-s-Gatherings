import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "hello@michellesgatherings.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Michelle's Gatherings <hello@michellesgatherings.com>";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const ptype = String(body.ptype || "").trim();
    const message = String(body.message || "").trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !okEmail || !ptype) {
      return NextResponse.json({ error: "Please add your name, a valid email, and a partnership type." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeType = escapeHtml(ptype);
    const safeMessage = escapeHtml(message || "No message provided.").replaceAll("\n", "<br />");

    const emails = [
      {
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: email,
        subject: `New partnership inquiry from ${name}`,
        html: `
        <div style="font-family: Helvetica, Arial, sans-serif; color: #2C2150; line-height: 1.6;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">New Michelle's Gatherings inquiry</h1>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Partnership type:</strong> ${safeType}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 16px; background: #F3ECFF; border: 1px solid rgba(44,33,80,0.14); border-radius: 6px;">
            ${safeMessage}
          </div>
        </div>
      `,
        text: [
          "New Michelle's Gatherings inquiry",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Partnership type: ${ptype}`,
          "",
          "Message:",
          message || "No message provided.",
        ].join("\n"),
      },
      {
        from: FROM_EMAIL,
        to: email,
        replyTo: TO_EMAIL,
        subject: "We received your note",
        html: `
        <div style="font-family: Helvetica, Arial, sans-serif; color: #2C2150; line-height: 1.6;">
          <h1 style="font-size: 24px; margin-bottom: 16px;">Thank you, ${safeName}.</h1>
          <p>Your note made it to Michelle's Gatherings. We'll read it soon and follow up if it feels like a fit.</p>
          <p><strong>Partnership type:</strong> ${safeType}</p>
          <div style="padding: 16px; background: #F3ECFF; border: 1px solid rgba(44,33,80,0.14); border-radius: 6px;">
            ${safeMessage}
          </div>
          <p style="margin-top: 24px;">With care,<br />Michelle's Gatherings</p>
        </div>
      `,
        text: [
          `Thank you, ${name}.`,
          "",
          "Your note made it to Michelle's Gatherings. We'll read it soon and follow up if it feels like a fit.",
          "",
          `Partnership type: ${ptype}`,
          "",
          "Message:",
          message || "No message provided.",
          "",
          "With care,",
          "Michelle's Gatherings",
        ].join("\n"),
      },
    ];

    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Resend contact form error:", error);
      return NextResponse.json({ error: error.message || "Email could not be sent." }, { status: 400 });
    }

    return NextResponse.json({ id: data?.id });
  } catch (error) {
    console.error("Contact form route error:", error);
    return NextResponse.json({ error: error?.message || "Something went wrong while sending the message." }, { status: 500 });
  }
}
