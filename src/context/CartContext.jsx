import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Config";

const CartContext = createContext(null);

// Key is per-user — guests get "guest", logged-in users get their UID
const cartKey = (uid) => `vividtechhub_cart_${uid || "guest"}`;

export function CartProvider({ children }) {
  const [uid, setUid]           = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Track auth state — when user changes, load their cart
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      const newUid = firebaseUser?.uid || null;
      setUid(newUid);

      // Load this user's saved cart from localStorage
      try {
        const saved = localStorage.getItem(cartKey(newUid));
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {
        setCartItems([]);
      }
    });
    return () => unsub();
  }, []);

  // Save cart to localStorage whenever items or user changes
  useEffect(() => {
    localStorage.setItem(cartKey(uid), JSON.stringify(cartItems));
  }, [cartItems, uid]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + parseFloat(i.price.replace(/[^0-9.]/g, "")) * i.qty,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}