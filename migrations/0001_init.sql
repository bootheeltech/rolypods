-- RolyPods launch schema: inventory, orders (Stripe Checkout), waitlist.

CREATE TABLE inventory (
  slug TEXT PRIMARY KEY,
  quantity_total INTEGER NOT NULL CHECK (quantity_total >= 0),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status: pending (reserved while the customer is on Stripe), paid, expired, canceled.
-- Stock is held by pending orders until expires_at, and permanently by paid orders.
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'canceled')),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  email TEXT,
  customer_name TEXT,
  phone TEXT,
  shipping_name TEXT,
  shipping_address TEXT, -- JSON from Stripe
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL,
  total_cents INTEGER,
  agreed_live_animal_terms_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at INTEGER NOT NULL, -- unix seconds
  paid_at TEXT,
  shipped_at TEXT,
  tracking_number TEXT,
  notes TEXT
);
CREATE INDEX orders_status_expires ON orders (status, expires_at);

CREATE TABLE order_items (
  order_id TEXT NOT NULL REFERENCES orders (id),
  slug TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  PRIMARY KEY (order_id, slug)
);
CREATE INDEX order_items_slug ON order_items (slug);

-- slug = a product slug, or 'any' for "tell me when anything new drops".
CREATE TABLE waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  notified_at TEXT,
  UNIQUE (email, slug)
);

-- Launch stock: 100 Dairy Cow isopods.
INSERT INTO inventory (slug, quantity_total) VALUES ('dairy-cow-isopod', 100);
