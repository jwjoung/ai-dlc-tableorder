import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  const syncStorage = (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = useCallback((menu) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === menu.id);
      let next;
      if (existing) {
        next = prev.map(item =>
          item.id === menu.id
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item
        );
      } else {
        next = [...prev, {
          id: menu.id,
          name: menu.name,
          price: menu.price,
          quantity: 1,
          image_url: menu.image_url || '',
        }];
      }
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((menuId, quantity) => {
    setItems(prev => {
      let next;
      if (quantity <= 0) {
        next = prev.filter(item => item.id !== menuId);
      } else {
        next = prev.map(item =>
          item.id === menuId ? { ...item, quantity: Math.min(quantity, 99) } : item
        );
      }
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((menuId) => {
    setItems(prev => {
      const next = prev.filter(item => item.id !== menuId);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem('cart');
    setItems([]);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = {
    items,
    totalAmount,
    totalItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
