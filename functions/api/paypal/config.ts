// GET /api/paypal/config -> the public client id the browser needs to load PayPal's buttons.
import { json, type Env } from "../../../server/lib";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.PAYPAL_CLIENT_ID) return json({ error: "PayPal is not configured." }, 503);
  return json({ clientId: env.PAYPAL_CLIENT_ID, env: env.PAYPAL_ENV === "live" ? "live" : "sandbox" });
};
