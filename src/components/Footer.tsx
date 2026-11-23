import { Instagram } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { store } from '../data/store';
import { categories } from '../data/products';
import { storeContactLinks } from '../lib/store-links';
import { Brand } from './Brand';
import { BrickSculpture } from './BrickSculpture';
import { heroModel } from '../data/hero-model';
function WhatsAppIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.6 6.4a9.3 9.3 0 0 1-12.9 13L3 21l1.6-4.6A9.3 9.3 0 1 1 20.6 6.4Z" />
      <path d="m8.1 7.4 1.4-.2 1.1 2.5-.9 1.1a8 8 0 0 0 3.4 3.4l1.1-.9 2.5 1.1-.2 1.4c-.2 1-1.1 1.5-2.1 1.3-4.1-.8-7.3-4-8.1-8.1-.2-1 .4-1.8 1.8-1.6Z" />
    </svg>
  );
}
export function SocialContact({
  name,
  href,
  children,
}: {
  name: string;
  href: string | null;
  children: ReactNode;
}) {
  return href ? (
    <a
      className="social-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} магазина BRIXUM — откроется в новой вкладке`}
    >
      {children}
    </a>
  ) : (
    <button
      className="social-link social-unconfigured"
      type="button"
      disabled
      aria-label={`${name} магазина BRIXUM — ссылка пока не указана`}
      title="Контактная ссылка ещё не указана владельцем"
    >
      {children}
    </button>
  );
}
export function Footer() {
  const links = storeContactLinks();
  const { pathname } = useLocation();
  return (
    <footer className="footer">
      <div className="container">
        {pathname === '/' && <BrickSculpture />}
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="footer-brand-link" to="/" aria-label="BRIXUM — главная">
              <Brand />
            </Link>
            <p>Коллекционные конструкторы, которые хочется собирать, дарить и сохранять.</p>
          </div>
          <nav className="footer-column" aria-label="Навигация в подвале">
            <h2>Навигация</h2>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог</Link>
            <Link to="/about">О магазине</Link>
            <Link to="/delivery">Доставка и оплата</Link>
          </nav>
          <nav className="footer-column" aria-label="Коллекции BRIXUM">
            <h2>Коллекции</h2>
            {categories.map((c) => (
              <Link key={c.id} to={`/catalog?category=${c.id}`}>
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="footer-column footer-contacts">
            <h2>Контакты</h2>
            <div className="footer-socials">
              <SocialContact name="Instagram" href={links.instagram}>
                <Instagram size={21} aria-hidden="true" />
              </SocialContact>
              <SocialContact name="WhatsApp" href={links.whatsapp}>
                <WhatsAppIcon />
              </SocialContact>
            </div>
            <p className="footer-city">{store.city}</p>
          </div>
        </div>
        <nav className="footer-legal" aria-label="Информация для покупателя">
          <Link to="/privacy">Конфиденциальность</Link>
          <Link to="/terms">Условия заказа</Link>
        </nav>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BRIXUM. Все права защищены.</p>
          <p className="footer-model-credit model-credit">
            3D:{' '}
            <a href={heroModel.url} target="_blank" rel="noopener noreferrer">
              {heroModel.title}
            </a>{' '}
            — {heroModel.author} /{' '}
            <a href={heroModel.licenseUrl} target="_blank" rel="noopener noreferrer">
              {heroModel.license}
            </a>{' '}
            · <Link to="/sources">Материалы и лицензии</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
