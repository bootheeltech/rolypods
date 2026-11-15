"use client";

import { useEffect, useRef, useState } from "react";
import type { CartItem } from "@/context/CartContext";

// Minimal typing for the PayPal JS SDK pieces we use.
interface PayPalButtonsInstance {
  render(el: HTMLElement): Promise<void>;
  close(): Promise<void>;
}
interface PayPalNamespace {
  Buttons(opts: {
    style?: Record<string, string | number>;
    createOrder: () => Promise<string>;
    onApprove: (data: unknown, actions: { restart: () => Promise<void> }) => Promise<void>;
    onCancel?: () => void;
    onError?: (err: unknown) => void;
  }): PayPalButtonsInstance;
}
declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

let sdkPromise: Promise<PayPalNamespace> | null = null;

function loadSdk(): Promise<PayPalNamespace> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = fetch("/api/paypal/config", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("PayPal is not configured"))))
    .then(
      ({ clientId }: { clientId: string }) =>
        new Promise<PayPalNamespace>((resolve, reject) => {
          const params = new URLSearchParams({
            "client-id": clientId,
            currency: "USD",
            intent: "capture",
            components: "buttons",
            "enable-funding": "venmo",
          });
          const s = document.createElement("script");
          s.src = `https://www.paypal.com/sdk/js?${params}`;
          s.async = true;
          s.onload = () => (window.paypal ? resolve(window.paypal) : reject(new Error("PayPal failed to load")));
          s.onerror = () => reject(new Error("PayPal failed to load"));
          document.head.appendChild(s);
        })
    )
    .catch((err) => {
      sdkPromise = null; // allow a retry on the next mount
      throw err;
    });
  return sdkPromise;
}

interface Props {
  items: CartItem[];
  /** Called when the server says stock is short, so the cart can be trimmed. */
  onStockShort: (slug: string, available: number) => void;
  onPaid: (orderId: string) => void;
}

export default function PayPalCheckout({ items, onStockShort, onPaid }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(items);
  const orderIdRef = useRef<string | null>(null);
  const handlers = useRef({ onStockShort, onPaid });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    itemsRef.current = items;
    handlers.current = { onStockShort, onPaid };
  });

  useEffect(() => {
    let buttons: PayPalButtonsInstance | null = null;
    let alive = true;

    const release = () => {
      const id = orderIdRef.current;
      orderIdRef.current = null;
      if (id) {
        fetch("/api/checkout/cancel", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: id }),
        }).catch(() => undefined);
      }
    };

    loadSdk()
      .then((paypal) => {
        if (!alive || !container.current) return;
        buttons = paypal.Buttons({
          style: { layout: "vertical", shape: "pill", label: "pay", height: 45 },
          createOrder: async () => {
            setError("");
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ items: itemsRef.current, agreed: true }),
            });
            const data = (await res.json().catch(() => ({}))) as {
              id?: string;
              orderId?: string;
              error?: string;
              slug?: string;
              available?: number;
            };
            if (!res.ok || !data.id || !data.orderId) {
              if (res.status === 409 && data.slug && typeof data.available === "number") {
                handlers.current.onStockShort(data.slug, data.available);
              }
              setError(data.error || "We couldn't start checkout. Please try again.");
              throw new Error(data.error || "create-order failed");
            }
            orderIdRef.current = data.orderId;
            return data.id;
          },
          onApprove: async (_data, actions) => {
            const orderId = orderIdRef.current;
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ orderId }),
            });
            const result = (await res.json().catch(() => ({}))) as { error?: string; restart?: boolean };
            if (result.restart) return actions.restart();
            if (!res.ok || !orderId) {
              orderIdRef.current = null; // server already released it
              setError(result.error || "Something went wrong confirming your payment.");
              return;
            }
            orderIdRef.current = null;
            handlers.current.onPaid(orderId);
          },
          onCancel: () => {
            release();
            setError("Checkout canceled. Nothing was charged, and your isopods are still available.");
          },
          onError: () => {
            release();
            setError((e) => e || "PayPal had a problem. Nothing was charged. Please try again.");
          },
        });
        return buttons.render(container.current);
      })
      .catch(() => alive && setError("Payment is temporarily unavailable. Please try again soon or email support@rolypods.com."))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      buttons?.close().catch(() => undefined);
    };
  }, []);

  return (
    <div>
      {loading && <div className="h-28 animate-pulse rounded-2xl bg-bark/10" aria-label="Loading payment options" />}
      <div ref={container} className="rounded-2xl bg-white p-3 empty:hidden" />
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-blush/40 bg-blush/10 px-4 py-3 text-sm text-blush-dark">
          {error}
        </p>
      )}
    </div>
  );
}
