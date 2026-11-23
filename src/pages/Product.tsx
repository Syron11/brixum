import { publicAsset } from '../lib/assets';
import { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Expand, Package, Minus } from 'lucide-react';
import {
  availabilityLabels,
  categories,
  maxQuantity,
  productBySlug,
  products,
} from '../data/products';
import { useCart } from '../state/CartProvider';
import { formatPrice } from '../lib/whatsapp';
import { Quantity } from '../components/Quantity';
import { ProductCard } from '../components/ProductCard';
export default function Product() {
  const { id } = useParams();
  const { state } = useLocation();
  const catalogUrl =
    typeof state?.catalogUrl === 'string' && /^\/catalog(?:\?|$)/.test(state.catalogUrl)
      ? state.catalogUrl
      : '/catalog';
  return <ProductDetail key={id} id={id || ''} catalogUrl={catalogUrl} />;
}
function ProductDetail({ id, catalogUrl }: { id: string; catalogUrl: string }) {
  const p = productBySlug.get(id);
  const { items, add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState('standard');
  const [view, setView] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  if (!p)
    return (
      <div className="container empty-state">
        <h1>Модель не найдена</h1>
        <p>Посмотрите другие модели в коллекции.</p>
        <Link to="/catalog" className="button button-red">
          Открыть каталог
        </Link>
      </div>
    );
  const remaining =
      maxQuantity(p) -
      items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.quantity, 0),
    v = p.variants.find((i) => i.id === variant)!;
  const image = (
    <img
      src={publicAsset(p.images[imageIndex])}
      alt={
        p.imagePending
          ? `Фотография ${p.name} готовится`
          : p.imageType === 'poster'
            ? `Промокарточка ${p.name}`
            : p.name
      }
      width={p.imageType === 'poster' ? 1254 : 1200}
      height={p.imageType === 'poster' ? 1254 : 1000}
      fetchPriority="high"
    />
  );
  return (
    <div className="container page-space">
      <Link to={catalogUrl} className="back-to-catalog">
        <ArrowLeft size={19} aria-hidden="true" />
        Вернуться в каталог
      </Link>
      <nav className="breadcrumb" aria-label="Хлебные крошки">
        <Link to="/catalog">Каталог</Link> /{' '}
        <Link to={`/catalog?category=${p.category}`}>
          {categories.find((c) => c.id === p.category)?.name}
        </Link>{' '}
        / {p.sku}
      </nav>
      <div className="product-detail">
        <div className="gallery">
          {p.imagePending ? (
            <div className="gallery-main placeholder-gallery">{image}</div>
          ) : (
            <>
              <button
                className={`gallery-main ${p.imageType === 'poster' ? 'gallery-poster' : ''} ${view ? 'detail-view' : ''}`}
                onClick={() => setView(!view)}
                aria-label={view ? 'Показать общий вид' : 'Увеличить деталь фотографии'}
              >
                {image}
                <span className="zoom-label">
                  {view ? (
                    <Minus size={18} aria-hidden="true" />
                  ) : (
                    <Expand size={18} aria-hidden="true" />
                  )}
                  {view ? 'Общий вид' : 'Рассмотреть деталь'}
                </span>
              </button>
              {p.images.length > 1 && (
                <div className="gallery-thumbs">
                  {p.images.map((src, i) => (
                    <button
                      key={src}
                      aria-label={`Фото ${i + 1}`}
                      aria-pressed={imageIndex === i}
                      className={imageIndex === i ? 'active' : ''}
                      onClick={() => {
                        setImageIndex(i);
                        setView(false);
                      }}
                    >
                      <img src={publicAsset(src)} alt="" width="160" height="120" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="product-info">
          <p className="product-series">
            {categories.find((c) => c.id === p.category)?.name}
            <span>Артикул {p.sku}</span>
          </p>
          <h1>{p.name}</h1>
          {p.pricePreliminary && <p className="preliminary-price">Предварительная цена</p>}
          <div className="detail-price">{formatPrice(p.price + v.extra)}</div>
          <p className={`availability ${p.availability === 'in_stock' ? 'available' : ''}`}>
            {p.availability === 'in_stock' ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Minus size={16} aria-hidden="true" />
            )}
            {availabilityLabels[p.availability]}
          </p>
          <p className="product-description">{p.description}</p>
          {p.variants.length > 1 && (
            <div className="variant-label">
              <label htmlFor="product-variant">Комплектация</label>
              <select
                id="product-variant"
                name="variant"
                value={variant}
                onChange={(e) => {
                  setVariant(e.target.value);
                  setAdded(false);
                }}
              >
                {p.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                    {v.extra ? ` + ${formatPrice(v.extra)}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="buy-row">
            <Quantity
              value={Math.min(quantity, Math.max(1, remaining))}
              max={remaining}
              onChange={setQuantity}
            />
            <button
              className="button button-red"
              disabled={remaining < 1}
              onClick={() => {
                add({
                  productId: p.id,
                  variantId: variant,
                  quantity: Math.min(quantity, remaining),
                });
                setAdded(true);
              }}
            >
              {remaining < 1
                ? p.availability === 'out_of_stock'
                  ? 'Нет в наличии'
                  : 'Достигнут лимит запроса'
                : added
                  ? 'Добавить ещё'
                  : 'Добавить в корзину'}
            </button>
          </div>
          {added && (
            <Link className="added-link" to="/cart">
              Товар в корзине — перейти к оформлению
            </Link>
          )}
          <p className="product-process">
            <Package size={20} aria-hidden="true" />
            {p.availability === 'unconfirmed'
              ? 'Наличие уточняется. Добавление в корзину формирует запрос магазину и не подтверждает заказ.'
              : 'Наличие и условия доставки согласуются до подтверждения заказа.'}
          </p>
          <dl className="specifications">
            {Object.entries(p.specifications).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section className="section related">
        <div className="section-heading">
          <h2>Продолжение коллекции</h2>
          <Link className="text-link" to="/catalog">
            Весь каталог
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.id !== p.id && x.category === p.category)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
