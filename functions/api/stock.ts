// GET /api/stock -> { stock: { [slug]: availableUnits } } for every purchasable product.
import { availableStock, json, products, type Env } from "../../server/lib";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const stock: Record<string, number> = {};
  for (const p of products) {
    stock[p.slug] = p.inStock ? await availableStock(env.DB, p.slug) : 0;
  }
  return json({ stock });
};
