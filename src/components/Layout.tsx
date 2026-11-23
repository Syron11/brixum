import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { Brand } from './Brand';
import { Footer } from './Footer';
import { useCart } from '../state/CartProvider';
import { cartCount } from '../lib/cart';
export function Layout() {
  const { items, notice, undo, storageError } = useCart();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    if (previousPath.current !== pathname) {
      document.getElementById('main')?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    }
    if (open) window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          if (import.meta.env.VITE_ROUTER_MODE !== 'hash') return;
          event.preventDefault();
          const main = document.getElementById('main');
          main?.focus();
          main?.scrollIntoView({ block: 'start' });
        }}
      >
        К содержимому
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" aria-label="BRIXUM — главная">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <NavLink to="/catalog">Каталог</NavLink>
            <NavLink to="/about">О магазине</NavLink>
            <NavLink to="/delivery">Доставка и оплата</NavLink>
          </nav>
          <div className="header-actions">
            <Link
              className="icon-button search-link"
              to="/catalog?search=1"
              aria-label="Поиск по каталогу"
            >
              <Search size={21} aria-hidden="true" />
            </Link>
            <Link
              className="cart-link"
              to="/cart"
              aria-label={`Корзина, товаров: ${cartCount(items)}`}
            >
              <ShoppingBag size={21} aria-hidden="true" />
              <span className="cart-word">Корзина</span>
              <span className="cart-counter">{cartCount(items)}</span>
            </Link>
            <button
              id="menu-toggle"
              className="icon-button mobile-toggle"
              aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Мобильная навигация">
            <NavLink to="/catalog">Каталог</NavLink>
            <NavLink to="/about">О магазине</NavLink>
            <NavLink to="/delivery">Доставка и оплата</NavLink>
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {notice && (
          <div className="toast">
            <span>{notice}</span>
            {undo && <button onClick={undo}>Отменить</button>}
            <Link to="/cart">В корзину</Link>
          </div>
        )}
      </div>
      {storageError && (
        <div role="status" className="storage-warning">
          Браузер не разрешает сохранять корзину. Она доступна до перезагрузки страницы.
        </div>
      )}
    </>
  );
}
