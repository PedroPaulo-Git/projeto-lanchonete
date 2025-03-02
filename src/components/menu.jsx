'use client'
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsCategorizar = ["PROMOÇÃO", "HAMBÚRGUERES", "SUCOS", "COMBOS"];
  const items = [
    {
      name: "MEGA COMBO",
      description: "300gr de frango, 300gr de batata, 1 refri",
      price: "R$ 49,90",
      image: "https://dummyimage.com/120x80/000/fff&text=Combo", // Substituir pela imagem real
    },
    {
      name: "SUPER BURGER",
      description: "Hambúrguer artesanal com queijo duplo",
      price: "R$ 39,90",
      image: "https://dummyimage.com/120x80/000/fff&text=Burger",
    },
    {
      name: "BATATA FRITA",
      description: "Porção de batata frita crocante dsadas  dsada",
      price: "R$ 19,90",
      image: "https://dummyimage.com/120x80/000/fff&text=Batata",
    },
  ];

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
            className="flex  items-center gap-4 border-b border-gray-200 p-2 "
          >
            <div className="flex-1 text-[#212529]">
              <h3 className="font-semibold  text-md text-[#212529]">{item.name}</h3>
              <p className="text-gray-600 text-base">{item.description}</p>
              <p className="font-semibold  mt-1">{item.price}</p>
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
  );
}
