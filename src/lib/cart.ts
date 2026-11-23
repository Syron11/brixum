import { maxQuantity, productById } from '../data/products';
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
export const CART_KEY = 'brixum.cart.v1';
export const itemKey = (i: Pick<CartItem, 'productId' | 'variantId'>) =>
  `${i.productId}:${i.variantId}`;
export function unitPrice(item: CartItem) {
  const product = productById.get(item.productId);
  const variant = product?.variants.find((v) => v.id === item.variantId);
  return product && variant ? product.price + variant.extra : 0;
}
export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + unitPrice(i) * i.quantity, 0);
export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
export function normalizeCart(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];
  const result: CartItem[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const p = productById.get(raw.productId);
    if (
      !p ||
      maxQuantity(p) < 1 ||
      !p.variants.some((v) => v.id === raw.variantId) ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1
    )
      continue;
    const used = result.filter((i) => i.productId === p.id).reduce((n, i) => n + i.quantity, 0);
    const quantity = Math.min(raw.quantity, maxQuantity(p) - used);
    if (quantity < 1) continue;
    const existing = result.find((i) => itemKey(i) === itemKey(raw));
    if (existing) existing.quantity += quantity;
    else result.push({ productId: p.id, variantId: raw.variantId, quantity });
  }
  return result;
}
export function readCart(storage: Pick<Storage, 'getItem'>): CartItem[] {
  try {
    const parsed = JSON.parse(storage.getItem(CART_KEY) || 'null');
    return parsed?.version === 1 ? normalizeCart(parsed.items) : [];
  } catch {
    return [];
  }
}
export function addItem(items: CartItem[], item: CartItem) {
  const existing = items.find((i) => itemKey(i) === itemKey(item));
  return normalizeCart(
    existing
      ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity } : i))
      : [...items, item],
  );
}
