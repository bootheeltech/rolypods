-- Switch payments from Stripe to PayPal (Stripe declined the account, Nov 2026).
-- Stripe columns stay for history; new orders use the PayPal ones.
ALTER TABLE orders ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'paypal';
ALTER TABLE orders ADD COLUMN paypal_order_id TEXT;
ALTER TABLE orders ADD COLUMN paypal_capture_id TEXT;
CREATE UNIQUE INDEX orders_paypal_order_id ON orders (paypal_order_id);
