import { Resend } from "resend";

const PLACEHOLDER_API_KEY = "re_xxxxxxxxx";
const DEFAULT_FROM = "onboarding@resend.dev";
const DEFAULT_TO = "patrikbeaino@gmail.com";

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatFromEmail(value) {
  const raw = String(value || "").trim();
  if (!raw) return DEFAULT_FROM;
  return raw.includes("<") ? raw : `Entracte <${raw}>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!title || !name || !email) {
    return json({ error: "Film title, name, and email are required." }, 400);
  }

  const apiKey = env.RESEND_API_KEY || PLACEHOLDER_API_KEY;
  if (!apiKey || apiKey === PLACEHOLDER_API_KEY) {
    return json(
      { error: "Resend is not configured. Replace re_xxxxxxxxx with your real API key in RESEND_API_KEY." },
      500
    );
  }

  const resend = new Resend(apiKey);
  const html = `
    <p>You received a new private screening access request from the Entracte website.</p>
    <p><strong>Film:</strong> ${escapeHtml(title)}</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  `;

  try {
    const result = await resend.emails.send({
      from: formatFromEmail(env.RESEND_FROM_EMAIL || DEFAULT_FROM),
      to: env.CONTACT_TO_EMAIL || DEFAULT_TO,
      reply_to: email,
      subject: `Entracte Access Request: ${title}`,
      html
    });

    if (result && result.error) {
      throw new Error(result.error.message || "Email send failed.");
    }
  } catch (error) {
    return json({ error: error.message || "Failed to send email." }, 502);
  }

  return json({ ok: true });
}
