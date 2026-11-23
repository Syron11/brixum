import { store } from '../data/store';
import { whatsappUrl } from './whatsapp';
export function instagramUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      ['instagram.com', 'www.instagram.com'].includes(url.hostname) &&
      url.pathname !== '/'
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function whatsappBusinessUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'wa.me' &&
      /^\/message\/[A-Za-z0-9]+\/?$/.test(url.pathname) &&
      !url.search &&
      !url.hash
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export const orderWhatsappLink = (message: string) => whatsappUrl(store.whatsapp, message);
export const storeContactLinks = () => ({
  instagram: instagramUrl(store.instagram),
  whatsapp:
    orderWhatsappLink('Здравствуйте! Хочу узнать о коллекции BRIXUM.') ||
    whatsappBusinessUrl(store.whatsappLink),
});
export function instagramHandle(value: string): string | null {
  const url = instagramUrl(value);
  if (!url) return null;
  const username = new URL(url).pathname.match(/^\/([A-Za-z0-9._]+)\/?$/)?.[1];
  return username ? `@${username}` : null;
}
export function contactPhone(number: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return /^7\d{10}$/.test(number)
    ? number.replace(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 $1 $2 $3 $4')
    : `+${number}`;
}
