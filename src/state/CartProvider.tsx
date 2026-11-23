import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { addItem, CART_KEY, itemKey, normalizeCart, readCart } from '../lib/cart';
import type { CartItem } from '../lib/cart';
interface CartContextValue {
  items: CartItem[];
  add: (i: CartItem) => void;
  update: (key: string, q: number) => void;
  remove: (key: string) => void;
  notice: string;
  undo: (() => void) | null;
  storageError: boolean;
}
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return readCart(localStorage);
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState('');
  const [undo, setUndo] = useState<(() => void) | null>(null);
  const [storageError, setStorageError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ version: 1, items }));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [items]);
  useEffect(() => () => clearTimeout(timer.current), []);
  function announce(text: string, action?: () => void) {
    clearTimeout(timer.current);
    setNotice(text);
    setUndo(() => action || null);
    timer.current = setTimeout(() => {
      setNotice('');
      setUndo(null);
    }, 6500);
  }
  function add(item: CartItem) {
    setItems((prev) => addItem(prev, item));
    announce('Товар добавлен в корзину');
  }
  function update(key: string, quantity: number) {
    setItems((prev) =>
      normalizeCart(prev.map((i) => (itemKey(i) === key ? { ...i, quantity } : i))),
    );
  }
  function remove(key: string) {
    const removed = items.find((i) => itemKey(i) === key);
    setItems((prev) => prev.filter((i) => itemKey(i) !== key));
    announce('Товар удалён', () => {
      if (removed) setItems((prev) => addItem(prev, removed));
      setNotice('Удаление отменено');
      setUndo(null);
    });
  }
  return (
    <CartContext.Provider value={{ items, add, update, remove, notice, undo, storageError }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('CartProvider missing');
  return value;
}
