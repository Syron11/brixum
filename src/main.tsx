import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { CartProvider } from './state/CartProvider';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { About, Delivery, Sources, NotFound } from './pages/Info';
import { Privacy, OrderTerms } from './pages/Legal';
import '@fontsource-variable/manrope';
import '@fontsource-variable/oswald';
import './styles.css';
const createRouter =
  import.meta.env.VITE_ROUTER_MODE === 'hash' ? createHashRouter : createBrowserRouter;
const router = createRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="product/:id" element={<Product />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="about" element={<About />} />
      <Route path="delivery" element={<Delivery />} />
      <Route path="sources" element={<Sources />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<OrderTerms />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </React.StrictMode>,
);
