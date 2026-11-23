import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { store } from '../data/store';
import { categories, products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get('q') || '',
    category = params.get('category') || '',
    min = params.get('min') || '',
    max = params.get('max') || '',
    stock = params.get('stock') === '1',
    sort = params.get('sort') || 'selection';
  function set(key: string, value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete('search');
        return next;
      },
      { replace: true, flushSync: true },
    );
  }
  const filtered = products
    .filter(
      (p) =>
        (!query ||
          `${p.name} ${p.sku} ${p.searchTerms?.join(' ') || ''}`
            .toLocaleLowerCase('ru')
            .includes(query.trim().toLocaleLowerCase('ru'))) &&
        (!category || p.category === category) &&
        (!min || p.price >= Number(min)) &&
        (!max || p.price <= Number(max)) &&
        (!stock || p.availability === 'in_stock'),
    )
    .sort((a, b) =>
      sort === 'price-asc'
        ? a.price - b.price
        : sort === 'price-desc'
          ? b.price - a.price
          : sort === 'name'
            ? a.name.localeCompare(b.name, 'ru')
            : 0,
    );
  const active = !!(query || category || min || max || stock || sort !== 'selection');
  return (
    <div className="container page-space">
      <div className="page-heading">
        <div>
          <p className="breadcrumb">Главная / Каталог</p>
          <h1>
            Ваша следующая
            <br className="desktop-break" /> коллекция.
          </h1>
        </div>
        <p>
          От маленького увлечения
          <br />
          до большого проекта.
        </p>
      </div>
      <div className="catalog-search">
        <Search size={22} aria-hidden="true" />
        <input
          aria-label="Поиск по названию или артикулу"
          name="q"
          type="search"
          placeholder="Название модели или артикул…"
          value={query}
          onChange={(e) => set('q', e.target.value)}
        />
        {query && (
          <button className="icon-button" onClick={() => set('q', '')} aria-label="Очистить поиск">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="catalog-categories" aria-label="Категории">
        <button className={!category ? 'selected' : ''} onClick={() => set('category', '')}>
          Все модели <span>{products.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={category === c.id ? 'selected' : ''}
            onClick={() => set('category', c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="catalog-layout">
        <aside className="filters">
          <button
            className="filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="filter-content"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            Фильтры {active && <span className="filter-dot" />}
          </button>
          <div id="filter-content" className={`filter-content ${filtersOpen ? 'is-open' : ''}`}>
            <h2>Выбрать модель</h2>
            <fieldset>
              <legend>Цена, {store.currency}</legend>
              <div className="price-inputs">
                <label>
                  <span>От</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    name="min"
                    aria-label="Цена от"
                    placeholder="0"
                    value={min}
                    onChange={(e) => set('min', e.target.value)}
                  />
                </label>
                <label>
                  <span>До</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    name="max"
                    aria-label="Цена до"
                    placeholder="150 000"
                    value={max}
                    onChange={(e) => set('max', e.target.value)}
                  />
                </label>
              </div>
              {min && max && Number(min) > Number(max) && (
                <p className="field-error">Цена «от» должна быть меньше цены «до».</p>
              )}
            </fieldset>
            <label className="checkbox-label">
              <input
                name="stock"
                type="checkbox"
                checked={stock}
                onChange={(e) => set('stock', e.target.checked ? '1' : '')}
              />
              Только в наличии
            </label>
            <button
              className="reset-button"
              disabled={!active}
              onClick={() => setParams({}, { flushSync: true })}
            >
              Сбросить фильтры
            </button>
          </div>
        </aside>
        <div className="catalog-results">
          <div className="results-toolbar">
            <p aria-live="polite">
              Моделей: <strong>{filtered.length}</strong>
            </p>
            <label className="sort-label">
              <span className="sr-only">Сортировка</span>
              <select name="sort" value={sort} onChange={(e) => set('sort', e.target.value)}>
                <option value="selection">Выбор BRIXUM</option>
                <option value="price-asc">Сначала дешевле</option>
                <option value="price-desc">Сначала дороже</option>
                <option value="name">По названию</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={36} strokeWidth={1} aria-hidden="true" />
              <h2>Такой модели пока нет</h2>
              <p>Попробуйте другое название или измените фильтры.</p>
              <button
                className="button button-black"
                onClick={() => setParams({}, { flushSync: true })}
              >
                Показать все модели
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
