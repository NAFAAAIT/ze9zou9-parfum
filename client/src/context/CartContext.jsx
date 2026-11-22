import { createContext, useContext, useMemo, useState } from 'react';
const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('zp-cart') || '[]'));
  const update = (next) => { setItems(next); localStorage.setItem('zp-cart', JSON.stringify(next)); };
  const add = (product, size = product.sizes[0], quantity = 1) => {
    const key = `${product._id}-${size}`; const found = items.find((item) => item.key === key);
    update(found ? items.map((item) => item.key === key ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item) : [...items, { key, product, size, quantity }]);
  };
  const remove = (key) => update(items.filter((item) => item.key !== key));
  const change = (key, quantity) => quantity < 1 ? remove(key) : update(items.map((item) => item.key === key ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item));
  const value = useMemo(() => ({ items, add, remove, change, count: items.reduce((sum, i) => sum + i.quantity, 0), subtotal: items.reduce((sum, i) => sum + (i.product.price * (1 - i.product.discount / 100) * i.quantity), 0) }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
