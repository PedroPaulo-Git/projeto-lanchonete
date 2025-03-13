// contexts/CartContext.js
"use client";
import { createContext, useContext, useState, useCallback,useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [modalAddressOpen, setmodalAddressOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);


  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Atualizar localStorage sempre que cartItems mudar
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
    <CartContext.Provider value={{ cartItems, addToCart, clearCart,removeFromCart, modalAddressOpen, setmodalAddressOpen, savedAddress, setSavedAddress }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);