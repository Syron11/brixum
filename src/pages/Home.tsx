import { publicAsset } from '../lib/assets';
import { Link } from 'react-router-dom';
import { categories, products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { HeroRaceCar } from '../components/HeroRaceCar';
import { ArrowUpRight } from 'lucide-react';
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-intro">BRIXUM · Коллекционные конструкторы</p>
            <h1>
              Коллекция
              <br />с характером.
            </h1>
            <p className="hero-description">
              Азарт гоночной трассы. Тишина цветочной мастерской.
              <br />
              Выберите то, что хочется собрать своими руками.
            </p>
            <Link className="button button-red" to="/catalog">
              Открыть каталог
            </Link>
          </div>
          <div className="hero-visual hero-model-visual">
            <HeroRaceCar />
            <Link className="hero-caption" to="/catalog">
              <strong>Инженерия в каждой детали</strong>
              <span>Мир гоночных конструкторов</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <h2>Два мира. Ваш выбор.</h2>
          <p>Коллекции, к которым хочется вернуться.</p>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              className={`category-card category-${c.id}`}
              key={c.id}
              to={`/catalog?category=${c.id}`}
            >
              <img src={publicAsset(c.image)} alt="" width="1254" height="1254" loading="lazy" />
              <div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
              <span className="category-count">
                {products.filter((p) => p.category === c.id).length} моделей
              </span>
              <span className="category-arrow" aria-hidden="true">
                <ArrowUpRight size={23} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container featured">
        <div className="section-heading">
          <div>
            <h2>Место на вашей полке</h2>
            <p>Для себя и тех, кто разделяет ваше увлечение.</p>
          </div>
          <Link className="text-link" to="/catalog">
            Весь каталог <span className="count">{products.length}</span>
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.featured)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="about-band">
        <div className="container about-band-inner">
          <div className="about-statement">
            Сначала —<br />
            просто детали.
            <br />
            Потом — ваше.
          </div>
          <div className="about-band-copy">
            <h2>
              BRIXUM — пространство
              <br />
              для увлечённых.
            </h2>
            <p>
              Конструктор становится способом переключиться, разобраться в сложном и создать что-то
              своими руками. От гоночного силуэта до цветочной композиции — найдите проект, который
              близок именно вам.
            </p>
            <Link className="button button-white" to="/about">
              О магазине
            </Link>
          </div>
        </div>
      </section>
      <section className="section container closing">
        <h2>
          Следующая история
          <br />
          начинается с детали.
        </h2>
        <Link className="button button-red" to="/catalog">
          Найти свою модель
        </Link>
      </section>
    </>
  );
}
