# RolyPods go-live checklist

Code for launch is in the repo. These are the steps that need a person (accounts, secrets, dashboard settings).

Already done: D1 database `rolypods` created in Cloudflare, migrations `0001_init.sql` and `0002_paypal.sql` applied remotely (`inventory` counts **containers of 25**: Dairy Cow starts at 4 containers = 100 isopods).

Payments run through **PayPal** (Stripe declined the account in Nov 2026). Buyers can pay with a PayPal account, Venmo, or a debit/credit card without a PayPal account. PayPal collects the shipping address and emails the receipt.

## 1. PayPal Business account

1. Sign up or upgrade at paypal.com/business. Business type and name: same as you'd give any processor (RolyPods as the public name).
2. Confirm your email and link and verify your bank account so withdrawals work.
3. Account Settings > Business information: customer service email `support@rolypods.com`, and set the credit card statement name to `ROLYPODS`.
4. Install the PayPal Business app so you get a notification for every sale.

## 2. API credentials (developer.paypal.com)

Log in to developer.paypal.com with the same PayPal login. Go to **Apps & Credentials**.

- **Sandbox** tab: open the "Default Application" (or create an app named `rolypods-website`). Copy its **Client ID** and **Secret**. Sandbox > Accounts also lists a fake **personal** (buyer) account you can log in with for test purchases.
- **Live** tab: create an app named `rolypods-website`, then copy its **Client ID** and **Secret**.

## 3. Put the credentials in Cloudflare

From `C:\Dev\rolypods`. Each command asks you to paste the value.

Preview (sandbox credentials):

```bash
npx wrangler pages secret put PAYPAL_CLIENT_ID --project-name rolypods --env preview
```

```bash
npx wrangler pages secret put PAYPAL_CLIENT_SECRET --project-name rolypods --env preview
```

Production (live credentials): the same two commands without `--env preview`.

`wrangler.toml` already sets `PAYPAL_ENV` to `sandbox` on previews and `live` on production. Secrets only apply to new deployments: after setting them, retry the latest deployment in the Pages dashboard or push a commit.

No webhook is needed: the site confirms each payment with PayPal directly before showing the order as paid.

## 4. Test order on the preview

Preview: https://launch.rolypods.pages.dev (branch `launch`, not indexed, **shares the production database**).

1. Add 1 Dairy Cow, tick the agreement, click the PayPal button, and log in with the sandbox **personal** account (or use "Debit or Credit Card" with a sandbox test card from developer.paypal.com > Card Testing).
2. Confirm the success page shows an order number, the sandbox business account shows the payment, and this returns `paid`:
   `npx wrangler d1 execute rolypods --remote --command "SELECT order_number, status, email, shipping_address FROM orders ORDER BY created_at DESC LIMIT 5"`
3. Start a second checkout and close the PayPal window: the site should say nothing was charged and the stock comes straight back.
4. Before real customers buy, delete the test orders so they don't hold stock:
   `npx wrangler d1 execute rolypods --remote --command "DELETE FROM order_items; DELETE FROM orders"`
5. Set the live credentials on production (step 3) and merge `launch` into `master`.

## 6. AI crawlers (decided: keep Cloudflare's blocking on)

Cloudflare's managed robots.txt for rolypods.com stays **on** (decision Nov 2026). It adds rules blocking AI *training* crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, Amazonbot, CCBot, Bytespider and others) in front of the site's own robots.txt.

AI *answer* and search bots are not blocked, and the site's `src/app/robots.ts` explicitly allows them: Googlebot, Bingbot, OAI-SearchBot and ChatGPT-User (ChatGPT search), Claude-SearchBot and Claude-User, PerplexityBot and Perplexity-User, Applebot, DuckAssistBot. So Google (including AI Overviews), Bing/Copilot, ChatGPT search, Perplexity and Claude search can still find and cite the shop.

Don't add training crawlers to `robots.ts`, or the file contradicts Cloudflare's rules. The separate "Block AI bots" switch in Security > Bots was not checked (the API token on Tim's PC can't read bot settings).

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

- New orders: PayPal Business app notifications, plus the "orders to ship" command in `docs/claude-project.md`.
- The site refuses Alaska, Hawaii, US territories, and obvious PO boxes before charging, but still glance at each address before packing.
- Supplies list: `docs/shipping-supplies.md`.
