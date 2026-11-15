// POST /api/waitlist { email, slug, website } -> adds the email to the waitlist for a species (or 'any').
import { EMAIL_RE, getProduct, json, type Env } from "../../server/lib";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string; slug?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (body.website) return json({ ok: true });

  const email = String(body.email ?? "").trim().toLowerCase();
  const slug = String(body.slug ?? "any");
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Please enter a valid email address." }, 400);
  }
  if (slug !== "any" && !getProduct(slug)) {
    return json({ error: "Unknown species." }, 400);
  }

  await env.DB.prepare("INSERT OR IGNORE INTO waitlist (email, slug) VALUES (?1, ?2)").bind(email, slug).run();
  return json({ ok: true });
};
