// Single source for shipping pricing, used by the cart, checkout page, and the PayPal create-order function.
export const SHIPPING_FLAT_RATE = 12.5;
export const FREE_SHIPPING_THRESHOLD = 75;

export function shippingFor(subtotal: number) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
}
