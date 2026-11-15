# RolyPods go-live checklist

Code for launch is in the repo. These are the steps that need a person (accounts, secrets, dashboard settings).

Already done: D1 database `rolypods` created in Cloudflare and migration `0001_init.sql` applied remotely (100 Dairy Cows in `inventory`).

## 1. Stripe (payments)

1. Create or finish the Stripe account at dashboard.stripe.com and complete verification (business info, bank account, identity). Business description: "captive-bred live isopods (pet invertebrates)".
2. Settings > Customer emails: turn on **Successful payments** and **Refunds** receipts.
3. Settings > Business > Public details: set support email `support@rolypods.com` and statement descriptor `ROLYPODS`.
4. Turn on email notifications for yourself for successful payments (Settings > Team and security > Communication preferences) and install the Stripe phone app so you hear about orders right away.
5. Developers > API keys: copy the **test** secret key first (`sk_test_...`), then the live one when you're ready.

## 2. Secrets in Cloudflare Pages

From `C:\Dev\rolypods`:

```bash
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name rolypods
```

```bash
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name rolypods
```

Use the test key and test webhook secret first, run a test order, then replace both with live values.

## 3. Stripe webhook

Developers > Webhooks > Add endpoint:

- URL: `https://rolypods.com/api/stripe-webhook`
- Events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- Copy the signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` (step 2).

Test mode and live mode each have their own webhook endpoint and secret.

## 4. Deploy

Push to `master`. Cloudflare Pages builds (`npm run build`) and deploys automatically. The new `wrangler.toml` binds the D1 database. After the deploy, a new deployment is needed for secrets to take effect if you set them afterward (push again or "Retry deployment" in the Pages dashboard).

## 5. Test order (test mode)

1. Buy 1 Dairy Cow on the site. Card `4242 4242 4242 4242`, any future date, any CVC.
2. Confirm the success page shows an order number, the Stripe dashboard shows the payment, and this returns the order as `paid`:
   `npx wrangler d1 execute rolypods --remote --command "SELECT order_number, status, email FROM orders ORDER BY created_at DESC LIMIT 5"`
3. Start a second checkout and click back on the Stripe page: stock should return right away.
4. Delete the test orders (before any real orders exist) so they don't hold stock:
   `npx wrangler d1 execute rolypods --remote --command "DELETE FROM order_items; DELETE FROM orders"`
5. Swap both secrets to live values and redeploy.

## 6. Cloudflare settings for AI search (dashboard: rolypods.com zone)

Your live robots.txt is currently being **replaced by Cloudflare's managed robots.txt**, which blocks GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Amazonbot and others. That keeps RolyPods out of ChatGPT, Claude, Gemini, and Apple answers.

- Security > Bots (or AI Crawl Control): turn **off** "Manage your robots.txt" / "Instruct AI bot traffic with robots.txt".
- Turn **off** "Block AI bots" if it's on.
- Then check https://rolypods.com/robots.txt shows the site's own rules (starts with `User-Agent: *` and lists the AI bots as allowed).

## 7. Search engines

1. Google Search Console: add the domain property `rolypods.com` (DNS TXT record in Cloudflare), submit `https://rolypods.com/sitemap.xml`, and request indexing for `/` and `/shop/dairy-cow-isopod`.
2. Bing Webmaster Tools: import from Search Console (this also feeds Copilot and DuckDuckGo).
3. Google Merchant Center (free listings): add the store; it can read the Product structured data on each species page. Live animals may need review, so expect a manual check.
4. Validate structured data once live: Google Rich Results Test on `/shop/dairy-cow-isopod`.

## 8. Content that will move the needle most

- **Real photos** of your Dairy Cows (and the packed box). The site uses drawn illustrations; Google product results and AI answers favor real images. Add them and I can wire them into the product pages and share images.
- A Google Business Profile is optional (online-only shops can list as a service-area business).
- Post the launch where isopod people are: r/isopods, Facebook isopod groups (check each group's seller rules), and Instagram/TikTok with a link to `/shop/dairy-cow-isopod`.

## 9. Launch-day ops

- New orders: Stripe app notifications, plus the "orders to ship" command in `docs/claude-project.md`.
- Check every address before packing (Stripe can't block AK, HI, PR, or PO boxes).
- Supplies list: `docs/shipping-supplies.md`.
