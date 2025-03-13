"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IoMenu } from "react-icons/io5";
import Modal from "./modals/modal";
import CartFooter from "./cartfooter";
//import modalAddress from "./modals/modalAddress";
import { useCart } from "@/app/context/contextComponent";

export default function Menu({setmodalAddressOpen}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsCategorizar = ["PROMOÇÃO", "HAMBÚRGUERES", "SUCOS", "COMBOS"];
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { cartItems, addToCart, clearCart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const sectionRefs = useRef({});


  // Carrega os itens do JSON
  useEffect(() => {
    import("../menuItems.json")
      .then((data) => setItems(data.default || []))
      .catch((err) => console.error("Erro ao carregar JSON:", err));
  }, []);

  // Monitora mudanças em selectedItem
  useEffect(() => {
    if (selectedItem) {
      console.log("Item selecionado", selectedItem);
    }
    console.log(items)
  }, [selectedItem]);

  // Categoriza os itens (usando useMemo para evitar recálculos desnecessários)
  const categorizedItems = useMemo(() => {
    return itemsCategorizar.reduce((acc, category) => {
      acc[category] = items.filter((item) => item.category === category);
      return acc;
    }, {});
  }, [items, itemsCategorizar]);

  // Função para rolar até uma categoria
  const scrollToCategory = (category) => {
    setActiveIndex(itemsCategorizar.indexOf(category));
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className="p-4">
      <div>
        <IoMenu className="text-[#212529] text-5xl absolute ml-2 left-0 z-10 h-12 px-2 bg-white" />
        <div className="relative flex gap-10 overflow-x-auto mb-9 bg-white scrollbar-hidden pl-14">
          {itemsCategorizar.map((item, index) => (
            <div
              key={index}
              onClick={() => scrollToCategory(item)}
              className={`min-w-[100px] h-12 flex items-center justify-center font-semibold cursor-pointer
                ${
                  activeIndex === index
                    ? "border-b-[3px] border-black text-[#212529]"
                    : "text-gray-500"
                }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-2xl mx-auto bg-white border-b-[1px] border-y-gray-300 mb-20">
        {itemsCategorizar.map((category, index) => (
          <div key={index} ref={(el) => (sectionRefs.current[category] = el)}>
            <h1 className="font-semibold text-xl text-gray-500 bg-[#f8f9fa] py-4">
              {category}
            </h1>
            <div className="max-w-2xl mx-auto bg-white border-y-[1px] border-y-gray-300 shadow-lg">
              {categorizedItems[category]?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-gray-200 p-2 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex-1 text-[#212529]">
                    <h3 className="font-semibold text-md text-[#212529]">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-base">{item.description}</p>
                    <p className="font-semibold mt-1">{item.price}</p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-16 rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

     
      <CartFooter
        // onClearCart={() => setCartItems([])}
        cartItems={cartItems || []}
        totalPrice={totalPrice || 0}
        setmodalAddressOpen={setmodalAddressOpen}
      />
      {selectedItem && (
        <Modal
          key={selectedItem.id}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          // onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}