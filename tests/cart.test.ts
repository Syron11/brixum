import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addItem, cartCount, cartTotal, normalizeCart, readCart, unitPrice } from '../src/lib/cart';
import { orderMessage, whatsappUrl } from '../src/lib/whatsapp';
import { productById, products } from '../src/data/products';
import {
  instagramUrl,
  whatsappBusinessUrl,
  orderWhatsappLink,
  storeContactLinks,
  contactPhone,
  instagramHandle,
} from '../src/lib/store-links';
import { store } from '../src/data/store';
const id = 'mercedes-amg-petronas-f1';
const standard = { productId: id, variantId: 'standard', quantity: 2 };
const original = productById.get(id)!;
describe('Расчёты корзины и остатки', () => {
  beforeEach(() =>
    productById.set(id, {
      ...original,
      availability: 'in_stock',
      stock: 8,
      variants: [
        { id: 'standard', name: 'Набор', extra: 0 },
        { id: 'display', name: 'Тестовый вариант', extra: 5000 },
      ],
    }),
  );
  afterEach(() => productById.set(id, original));
  it('считает количества и цену комплектации', () => {
    const display = { ...standard, variantId: 'display', quantity: 1 };
    expect(unitPrice(display)).toBe(23000);
    expect(cartCount([standard, display])).toBe(3);
    expect(cartTotal([standard, display])).toBe(59000);
    expect(cartTotal([])).toBe(0);
  });
  it('объединяет позиции и ограничивает общий подтверждённый остаток', () => {
    const items = addItem([{ ...standard, quantity: 7 }], {
      ...standard,
      variantId: 'display',
      quantity: 5,
    });
    expect(cartCount(items)).toBe(8);
    expect(items[1].quantity).toBe(1);
    expect(addItem([standard], standard)[0].quantity).toBe(4);
  });
  it('не добавляет отсутствующий товар и невалидные данные', () => {
    expect(
      normalizeCart([
        null,
        { ...standard, quantity: 0 },
        { ...standard, quantity: 1.2 },
        { ...standard, productId: 'unknown' },
        { ...standard, variantId: 'unknown' },
      ]),
    ).toEqual([]);
    productById.set(id, { ...original, availability: 'out_of_stock', stock: 0 });
    expect(normalizeCart([standard])).toEqual([]);
  });
  it('восстанавливает корзину и переживает повреждённое хранилище', () => {
    expect(readCart({ getItem: () => JSON.stringify({ version: 1, items: [standard] }) })).toEqual([
      standard,
    ]);
    for (const value of ['{broken', 'null', JSON.stringify({ version: 2, items: [standard] })])
      expect(readCart({ getItem: () => value })).toEqual([]);
    expect(
      readCart({
        getItem: () => {
          throw Error('blocked');
        },
      }),
    ).toEqual([]);
  });
});
describe('Реальный каталог и запрос магазину', () => {
  it('содержит утверждённые цены, отдельные иллюстрации и не выдумывает остатки', () => {
    expect(products).toHaveLength(11);
    expect(new Set(products.map((p) => p.images[0])).size).toBe(11);
    expect(products.every((p) => p.availability === 'unconfirmed' && p.stock === null)).toBe(true);
    expect(
      products
        .filter((p) => p.category === 'botanical')
        .every((p) => !p.pricePreliminary && !p.imagePending && !p.specifications['Масштаб']),
    ).toBe(true);
    expect(products.map((p) => p.price)).toEqual([
      18000, 19900, 18350, 18990, 18990, 8990, 8990, 8990, 8990, 8990, 9490,
    ]);
  });
  it('считает пример владельца и явно просит подтверждение наличия', () => {
    const items = [
      { ...standard, quantity: 1 },
      { productId: 'pink-roses', variantId: 'standard', quantity: 2 },
    ];
    expect(cartTotal(items)).toBe(35980);
    const msg = orderMessage(items, {
      city: ' Астана ',
      comment: 'Подарок & коробка? 🎁',
    });
    for (const text of [
      'Mercedes-AMG F1 W14 E Performance',
      'Артикул: BRX-F1-001',
      'BRX-BOT-001',
      'Уточнить наличие',
      'Город: Астана',
      'Подарок & коробка? 🎁',
    ])
      expect(msg).toContain(text);
    expect(msg).toMatch(/Итого за товары: 35\s980/);
    expect(msg).not.toMatch(/демонстрац|заказ подтверждён|Имя:|цена предварительная/i);
  });
  it('кодирует все символы сообщения без потерь', () => {
    const msg = orderMessage([standard], {
      city: 'Астана',
      comment: 'Нужно 2? #1 + 🎁',
    });
    const url = whatsappUrl('77001234567', msg)!;
    expect(new URL(url).searchParams.get('text')).toBe(msg);
    expect(url).toContain('%0A');
  });
  it('запрещает пустой заказ и не строит ссылку с неподходящим номером', () => {
    expect(() => orderMessage([], { city: '', comment: '' })).toThrow('Корзина пуста');
    for (const number of ['', '+77001234567', 'abc', '123', '000000000'])
      expect(whatsappUrl(number, 'test')).toBeNull();
  });
});
describe('Контакты магазина', () => {
  it('использует ссылки владельца и не допускает посторонние URL', () => {
    expect(storeContactLinks()).toEqual({
      instagram: 'https://www.instagram.com/brickcars.kz/',
      whatsapp: whatsappUrl('77476502456', 'Здравствуйте! Хочу узнать о коллекции BRIXUM.'),
    });
    expect(orderWhatsappLink('Текст заказа')).toBe(whatsappUrl('77476502456', 'Текст заказа'));
    expect(instagramHandle(store.instagram)).toBe('@brickcars.kz');
    expect(contactPhone(store.whatsapp)).toBe('+7 747 650 24 56');
    expect(contactPhone('')).toBeNull();
    expect(instagramHandle('javascript:alert(1)')).toBeNull();
    expect(whatsappBusinessUrl('https://wa.me.evil.org/message/TEST')).toBeNull();
    expect(whatsappBusinessUrl('https://wa.me/message/TEST?redirect=evil')).toBeNull();
    expect(instagramUrl('https://www.instagram.com/brixum/')).toBe(
      'https://www.instagram.com/brixum/',
    );
    for (const value of [
      'javascript:alert(1)',
      'https://instagram.com.example.org/name',
      'http://instagram.com/name',
      'https://instagram.com/',
    ])
      expect(instagramUrl(value)).toBeNull();
  });
  it('не подменяет заказ короткой ссылкой без текста при отсутствии номера', () => {
    const previous = store.whatsapp;
    try {
      store.whatsapp = '';
      expect(orderWhatsappLink('Готовый заказ')).toBeNull();
      expect(storeContactLinks().whatsapp).toBe(store.whatsappLink);
    } finally {
      store.whatsapp = previous;
    }
  });
  it('использует один номер для контакта и оформления', () => {
    const previous = store.whatsapp;
    try {
      store.whatsapp = '77001234567';
      const contact = storeContactLinks().whatsapp!;
      const order = whatsappUrl(
        store.whatsapp,
        orderMessage([standard], { city: 'Астана', comment: '' }),
      )!;
      expect(new URL(contact).pathname).toBe(new URL(order).pathname);
    } finally {
      store.whatsapp = previous;
    }
  });
});
