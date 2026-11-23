import { availabilityLabels, productById } from '../data/products';
import { store } from '../data/store';
import { cartTotal, unitPrice } from './cart';
import type { CartItem } from './cart';
export interface Customer {
  city: string;
  comment: string;
}
export const formatPrice = (value: number) =>
  new Intl.NumberFormat(store.locale, {
    style: 'currency',
    currency: store.currency,
    maximumFractionDigits: 0,
  }).format(value);
export function orderMessage(items: CartItem[], customer: Customer): string {
  if (!items.length) throw new Error('Корзина пуста');
  const lines = items.map((item, index) => {
    const p = productById.get(item.productId)!;
    const variant = p.variants.find((v) => v.id === item.variantId)!;
    return `${index + 1}. ${p.name}\nАртикул: ${p.sku}\n${availabilityLabels[p.availability]}${p.pricePreliminary ? '; цена предварительная' : ''}\nКомплектация: ${variant.name}\n${item.quantity} шт. × ${formatPrice(unitPrice(item))} = ${formatPrice(unitPrice(item) * item.quantity)}`;
  });
  return [
    `Здравствуйте! Хочу оформить заказ в ${store.name}.`,
    'Товары:',
    ...lines,
    `Итого за товары: ${formatPrice(cartTotal(items))}`,
    `Город: ${customer.city.trim()}`,
    `Комментарий: ${customer.comment.trim() || 'Без комментария'}`,
    'Доставка и окончательная стоимость требуют согласования. Пожалуйста, подтвердите наличие и условия заказа.',
  ]
    .filter(Boolean)
    .join('\n\n');
}
export function whatsappUrl(number: string, message: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
