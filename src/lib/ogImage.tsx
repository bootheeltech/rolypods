import { Fragment, isValidElement, type ReactNode } from "react";
import { ImageResponse } from "next/og";
import IsopodIllustration from "@/components/IsopodIllustration";
import type { Product } from "@/lib/products";

export const OG_SIZE = { width: 1200, height: 630 };

const ATTR_RENAMES: Record<string, string> = { className: "class", strokeWidth: "stroke-width", stopColor: "stop-color", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin", fillOpacity: "fill-opacity", strokeOpacity: "stroke-opacity", stopOpacity: "stop-opacity" };

const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * Minimal SVG serializer for our own illustration component (plain elements, fragments, arrays,
 * and function components). next/og can't take fragments inside <svg>, and react-dom/server is
 * not allowed in metadata routes, so we serialize to a data URI instead.
 */
function toSvg(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return esc(String(node));
  if (Array.isArray(node)) return node.map(toSvg).join("");
  if (!isValidElement(node)) return "";
  const { type } = node;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  if (type === Fragment) return toSvg(props.children);
  if (typeof type === "function") return toSvg((type as (p: unknown) => ReactNode)(props));
  if (typeof type !== "string") return "";
  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && v !== undefined && v !== null && v !== false)
    .map(([k, v]) => ` ${ATTR_RENAMES[k] ?? k}="${esc(String(v))}"`)
    .join("");
  return `<${type}${attrs}>${toSvg(props.children)}</${type}>`;
}

/** 1200x630 share card: illustration on the left, name and tagline on the right. */
export function renderOgImage(opts: {
  title: string;
  subtitle: string;
  badge: string;
  colors: Product["colors"];
  pattern: Product["pattern"];
}) {
  const svg = toSvg(<IsopodIllustration colors={opts.colors} pattern={opts.pattern} size={480} />).replace(
    "<svg ",
    '<svg xmlns="http://www.w3.org/2000/svg" '
  );
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{ display: "flex", width: "100%", height: "100%", background: "#f6f1e4", padding: 60, alignItems: "center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={480} height={480} alt="" style={{ borderRadius: 32 }} />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 56, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#4a3626" }}>
            RolyPods<span style={{ color: "#d1477a" }}>.</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 64, fontWeight: 700, lineHeight: 1.05, color: "#2e2013" }}>
            {opts.title}
          </div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#4a3626" }}>{opts.subtitle}</div>
          <div style={{ display: "flex", marginTop: 32 }}>
            <div
              style={{
                display: "flex",
                background: "#4c6b4f",
                color: "white",
                fontSize: 26,
                fontWeight: 700,
                padding: "10px 24px",
                borderRadius: 999,
              }}
            >
              {opts.badge}
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
