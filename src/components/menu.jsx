'use client'
import { useState,useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import Modal from "./modal";

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsCategorizar = ["PROMOÇÃO", "HAMBÚRGUERES", "SUCOS", "COMBOS"];
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    // Importa os dados dos arquivos JSON
    import("../menuItems.json").then((data) => setItems(data.default));
  
  }, []);


  return (
    <div className="p-4 ">


        <div>
     <IoMenu className="text-[#212529] text-5xl absolute ml-2 left-0 z-20 h-12 px-2  bg-white"/>

     <div className="relative flex gap-10 overflow-x-auto mb-9 bg-white scrollbar-hidden pl-14">

      {itemsCategorizar.map((item, index) => (
        <div
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`min-w-[100px] h-12 flex items-center justify-center font-semibold cursor-pointer
            ${activeIndex === index ? "border-b-[3px] border-black text-[#212529]" : "text-gray-500 "}`}
        >
          {item}
        </div>
      ))}
    </div>
    </div>
      <h1 className="font-semibold text-xl text-gray-500 mb-4">PROMOÇÃO</h1>
      <div className="max-w-2xl mx-auto bg-white  border-y-[1px] border-y-gray-300 shadow-lg mb-40 ">
      {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-200 p-2 cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex-1 text-[#212529]">
              <h3 className="font-semibold text-md text-[#212529]">{item.name}</h3>
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
          <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </div>
  );
}
