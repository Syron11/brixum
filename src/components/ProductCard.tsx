import { publicAsset } from '../lib/assets';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../data/products';
import { availabilityLabels, categories, maxQuantity } from '../data/products';
import { formatPrice } from '../lib/whatsapp';
import { useCart } from '../state/CartProvider';
export function ProductCard({ product: p }: { product: Product }) {
  const { items, add } = useCart();
  const location = useLocation();
  const backState =
    location.pathname === '/catalog'
      ? { catalogUrl: location.pathname + location.search }
      : undefined;
  const [added, setAdded] = useState(false);
  const remaining =
    maxQuantity(p) - items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.quantity, 0);
  return (
    <article className={`product-card ${p.imageType === 'poster' ? 'product-card-poster' : ''}`}>
      <Link
        to={`/product/${p.slug}`}
        state={backState}
        className="product-image"
        aria-label={`Подробнее: ${p.name}`}
      >
        <img
          src={publicAsset(p.images[0])}
          alt={
            p.imagePending
              ? `Место для фотографии: ${p.name}`
              : p.imageType === 'poster'
                ? `Промокарточка ${p.name}`
                : p.name
          }
          width={p.imageType === 'poster' ? 1254 : 800}
          height={p.imageType === 'poster' ? 1254 : 620}
          loading="lazy"
        />
        {p.imageType !== 'poster' && (
          <span className="product-status">{availabilityLabels[p.availability]}</span>
        )}
      </Link>
      <div className="product-meta">
        <span>{categories.find((c) => c.id === p.category)?.name}</span>
        {p.specifications['Масштаб'] && <span>{p.specifications['Масштаб']}</span>}
      </div>
      <h3>
        <Link to={`/product/${p.slug}`} state={backState}>
          {p.name}
        </Link>
      </h3>
      {p.imageType === 'poster' && (
        <span className="poster-stock">{availabilityLabels[p.availability]}</span>
      )}
      <p className="product-card-description">{p.shortDescription}</p>
      {p.pricePreliminary && <span className="preliminary-price">Предварительная цена</span>}
      <div className="product-bottom">
        <span className="price">{formatPrice(p.price)}</span>
        <button
          className="card-add"
          aria-label={`Добавить в корзину: ${p.name}`}
          disabled={remaining < 1}
          onClick={() => {
            add({ productId: p.id, variantId: p.variants[0].id, quantity: 1 });
            setAdded(true);
          }}
        >
          {added ? <Check size={15} aria-hidden="true" /> : null}
          {remaining < 1 ? 'Недоступно' : 'В корзину'}
        </button>
      </div>
    </article>
  );
}
