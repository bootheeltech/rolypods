import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Search engines and AI *answer* bots are welcome so RolyPods can be found and cited.
// AI *training* crawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, etc.) are
// intentionally not listed: Cloudflare's managed robots.txt for this zone blocks them, and Tim chose to
// keep that on (Nov 2026). Don't add them here or the file contradicts Cloudflare's rules.
const SEARCH_AND_ANSWER_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/cart", "/checkout", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: SEARCH_AND_ANSWER_BOTS, allow: "/", disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
