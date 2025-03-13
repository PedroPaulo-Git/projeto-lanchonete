// contexts/CartContext.js
"use client";
import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
    }
    return price || 0;
  };



  const addToCart = useCallback((item, quantity, complements) => {
    const itemPrice = parsePrice(item.price);
  
    const complementsPrice = Object.values(complements || {}).reduce(
      (acc, complement) => acc + (parsePrice(complement.price) * complement.quantity),
      0
    );
  
    const totalItemPrice = itemPrice * quantity + complementsPrice;
  
    setCartItems(prev => [
      ...prev,
      {
        ...item,
        id: `${item.id}-${Date.now()}`, // Garante um ID único para cada novo item
        quantity,
        complements,
        totalItemPrice
      }
    ]);
  }, []);
  
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);
  

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart,removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);