import { publicAsset } from '../lib/assets';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, MessageCircle, Pencil } from 'lucide-react';
import { EmptyCart } from './Cart';
import { useCart } from '../state/CartProvider';
import { cartTotal, itemKey, unitPrice } from '../lib/cart';
import { formatPrice, orderMessage } from '../lib/whatsapp';
import type { Customer } from '../lib/whatsapp';
import { availabilityLabels, productById } from '../data/products';
import { orderWhatsappLink } from '../lib/store-links';
const draftKey = 'brixum.customer.session.v1';
function readDraft(): Customer {
  try {
    const d = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
    return {
      city: typeof d?.city === 'string' ? d.city.slice(0, 100) : '',
      comment: typeof d?.comment === 'string' ? d.comment.slice(0, 1000) : '',
    };
  } catch {
    return { city: '', comment: '' };
  }
}
export default function Checkout() {
  const { items } = useCart();
  const [customer, setCustomer] = useState<Customer>(readDraft);
  const [review, setReview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState('');
  const [opened, setOpened] = useState(false);
  const [consent, setConsent] = useState(false);
  const consentRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    try {
      // Перезаписываем старый черновик только актуальными полями, удаляя сохранённое ранее имя.
      sessionStorage.setItem(draftKey, JSON.stringify(customer));
    } catch {
      /* Форма продолжает работать без сохранения черновика. */
    }
  }, [customer]);
  if (!items.length) return <EmptyCart />;
  const message = orderMessage(items, customer),
    url = orderWhatsappLink(message);
  function change(field: keyof Customer, value: string) {
    const next = { ...customer, [field]: value };
    setCustomer(next);
    setReview(false);
    setCopyStatus('');
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setOpened(false);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!customer.city.trim()) next.city = 'Укажите город получения.';
    if (!consent) next.consent = 'Подтвердите согласие на передачу сведений через WhatsApp.';
    setErrors(next);
    if (Object.keys(next).length) {
      (next.city ? cityRef : consentRef).current?.focus();
      return;
    }
    setReview(true);
    requestAnimationFrame(() => reviewRef.current?.focus());
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus('Текст заказа скопирован');
    } catch {
      messageRef.current?.focus();
      messageRef.current?.select();
      setCopyStatus('Не удалось скопировать автоматически. Текст выделен — нажмите Ctrl+C или ⌘C.');
    }
  }
  return (
    <div className="container page-space checkout">
      <p className="breadcrumb">
        <Link to="/cart">Корзина</Link> / Оформление
      </p>
      <div className="page-heading">
        <h1>Почти в коллекции.</h1>
        <p>
          Уточните детали.
          <br />
          Решение о заказе остаётся за вами.
        </p>
      </div>
      <div className="checkout-layout">
        <div>
          <form noValidate onSubmit={submit} className="customer-form">
            <h2>Данные для заказа</h2>
            <p>
              Город и комментарий попадут в сообщение для магазина. На сервер сайта эти поля не
              отправляются. Не указывайте здесь данные документов и банковских карт.
            </p>
            <div className="field">
              <label htmlFor="customer-city">
                Город <span aria-hidden="true">*</span>
              </label>
              <input
                ref={cityRef}
                id="customer-city"
                name="city"
                autoComplete="address-level2"
                required
                maxLength={100}
                value={customer.city}
                onChange={(e) => change('city', e.target.value)}
                placeholder="Например, Алматы…"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
              />
              {errors.city && (
                <p id="city-error" className="field-error" role="alert">
                  {errors.city}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="customer-comment">
                Комментарий <span className="muted">необязательно</span>
              </label>
              <textarea
                id="customer-comment"
                name="comment"
                autoComplete="off"
                maxLength={1000}
                rows={3}
                value={customer.comment}
                onChange={(e) => change('comment', e.target.value)}
                placeholder="Пожелания к заказу или вопрос…"
              />
            </div>
            <p className="required-note">* Обязательные поля</p>
            <div className="consent-field">
              <label className="consent-label" htmlFor="order-consent">
                <input
                  ref={consentRef}
                  id="order-consent"
                  name="consent"
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    setReview(false);
                    setOpened(false);
                    setErrors((prev) => ({ ...prev, consent: '' }));
                  }}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                />
                <span>
                  Согласен передать сведения из сообщения магазину BRIXUM через WhatsApp для
                  обработки запроса.{' '}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                    О персональных данных
                  </Link>
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="field-error" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>
            <p className="checkout-terms-note">
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                Как согласуется заказ
              </Link>
            </p>
            <button className="button button-black" type="submit">
              {review ? 'Обновить предпросмотр' : 'Проверить сообщение заказа'}
            </button>
          </form>
          {review && (
            <section className="message-preview">
              <h2 ref={reviewRef} tabIndex={-1}>
                Сообщение готово к проверке
              </h2>
              <p>
                Проверьте товары, сумму и данные. Текст подставится в WhatsApp — вы сможете его
                изменить и отправить самостоятельно. Открытие чата не подтверждает заказ.
              </p>
              <label className="sr-only" htmlFor="order-message">
                Текст заказа
              </label>
              <textarea id="order-message" ref={messageRef} readOnly value={message} rows={17} />
              <div className="message-actions">
                <button className="button button-outline" onClick={copy}>
                  {copyStatus === 'Текст заказа скопирован' ? (
                    <Check size={18} aria-hidden="true" />
                  ) : (
                    <Copy size={18} aria-hidden="true" />
                  )}
                  Скопировать текст
                </button>
                {url ? (
                  <a
                    className="button button-red"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpened(true)}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Открыть WhatsApp
                  </a>
                ) : (
                  <button className="button button-red" disabled>
                    <MessageCircle size={18} aria-hidden="true" />
                    WhatsApp не настроен
                  </button>
                )}
              </div>
              {!url && (
                <p className="setup-note">
                  Номер магазина ещё не указан. Сейчас доступны предпросмотр и копирование
                  сообщения.
                </p>
              )}
              <p role="status">{copyStatus}</p>
              {opened && (
                <p role="status" className="setup-note">
                  WhatsApp открыт. Заказ ещё не подтверждён, корзина сохранена. Отправьте сообщение
                  и дождитесь ответа магазина.
                </p>
              )}
            </section>
          )}
        </div>
        <aside className="order-summary checkout-summary">
          <div className="review-heading">
            <h2>Состав заказа</h2>
            <Link to="/cart" aria-label="Изменить состав заказа">
              <Pencil size={18} aria-hidden="true" />
            </Link>
          </div>
          {items.map((i) => {
            const p = productById.get(i.productId)!;
            return (
              <div className="review-item" key={itemKey(i)}>
                <img src={publicAsset(p.images[0])} width="80" height="70" alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>
                    {p.sku} · {availabilityLabels[p.availability]}
                  </span>
                  <span>
                    {i.quantity} × {formatPrice(unitPrice(i))}
                  </span>
                </div>
                <strong>{formatPrice(unitPrice(i) * i.quantity)}</strong>
              </div>
            );
          })}
          <div className="summary-total">
            <span>Сумма товаров</span>
            <strong>{formatPrice(cartTotal(items))}</strong>
          </div>
          <p className="summary-note">
            Доставка не включена. Наличие, итоговая стоимость и условия заказа требуют подтверждения
            магазином.
          </p>
        </aside>
      </div>
    </div>
  );
}
