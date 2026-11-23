import { publicAsset } from '../lib/assets';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../state/CartProvider';
import { availabilityLabels, maxQuantity, productById } from '../data/products';
import { cartCount, cartTotal, itemKey, unitPrice } from '../lib/cart';
import { formatPrice } from '../lib/whatsapp';
import { Quantity } from '../components/Quantity';
export function EmptyCart() {
  return (
    <div className="container empty-state cart-empty">
      <ShoppingBag size={46} strokeWidth={1} aria-hidden="true" />
      <h1>Место для вашей коллекции</h1>
      <p>Корзина пока пуста. Найдите модель, которую захочется собрать.</p>
      <Link className="button button-red" to="/catalog">
        Открыть каталог
      </Link>
    </div>
  );
}
export default function Cart() {
  const { items, update, remove } = useCart();
  if (!items.length) return <EmptyCart />;
  return (
    <div className="container page-space">
      <p className="breadcrumb">
        <Link to="/catalog">Каталог</Link> / Корзина
      </p>
      <div className="section-heading cart-heading">
        <h1>
          Ваша корзина<span className="heading-count">{cartCount(items)}</span>
        </h1>
        <Link className="text-link" to="/catalog">
          Продолжить выбор
        </Link>
      </div>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const p = productById.get(item.productId)!,
              v = p.variants.find((v) => v.id === item.variantId)!,
              key = itemKey(item),
              others = items
                .filter((i) => i.productId === p.id && itemKey(i) !== key)
                .reduce((s, i) => s + i.quantity, 0);
            return (
              <article key={key} className="cart-item">
                <Link to={`/product/${p.slug}`} className="cart-item-image">
                  <img src={publicAsset(p.images[0])} alt={p.name} width="240" height="200" />
                </Link>
                <div className="cart-item-copy">
                  <span className="muted">{p.sku}</span>
                  <h2>
                    <Link to={`/product/${p.slug}`}>{p.name}</Link>
                  </h2>
                  <p>
                    {availabilityLabels[p.availability]}
                    {p.pricePreliminary ? '; цена предварительная' : ''}
                  </p>
                  <span className="cart-unit-price">{formatPrice(unitPrice(item))} / шт.</span>
                  <Quantity
                    label={p.name + ', ' + v.name}
                    value={item.quantity}
                    max={maxQuantity(p) - others}
                    onChange={(q) => update(key, q)}
                  />
                </div>
                <div className="cart-item-end">
                  <strong>{formatPrice(unitPrice(item) * item.quantity)}</strong>
                  <button
                    className="remove-button"
                    aria-label={`Удалить: ${p.name}, ${v.name}`}
                    onClick={() => remove(key)}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                    <span>Удалить</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="order-summary">
          <h2>Ваш выбор</h2>
          <div>
            <span>Товаров</span>
            <span>{cartCount(items)}</span>
          </div>
          <div>
            <span>Сумма товаров</span>
            <span>{formatPrice(cartTotal(items))}</span>
          </div>
          <p className="summary-delivery">
            Доставка рассчитывается отдельно после уточнения города и способа получения.
          </p>
          <div className="summary-total">
            <span>Итого за товары</span>
            <strong>{formatPrice(cartTotal(items))}</strong>
          </div>
          <Link className="button button-red" to="/checkout">
            Перейти к оформлению
          </Link>
          <p className="summary-note">
            Проверьте состав запроса. Наличие и предварительные цены требуют подтверждения магазина.
          </p>
        </aside>
      </div>
    </div>
  );
}
