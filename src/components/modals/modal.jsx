"use client";
import { useState, useEffect, useCallback,memo } from "react";
import { IoClose } from "react-icons/io5";
import { useCart } from "@/app/context/contextComponent";

const Modal = ({ item, onClose, onAddToCart }) => {
  const { addToCart } = useCart();
  console.log("Modal Rendered")
  if (!item) return null;
  const [quantity, setQuantity] = useState(1);

  const [selectedComplements, setSelectedComplements] = useState(
    item.complements?.reduce((acc, complement) => {
      acc[complement.name] = { quantity: 0, price: complement.price };
      return acc;
    }, {}) || {}
  );
  useEffect(() => {
    setQuantity(1);
    setSelectedComplements(
      item.complements?.reduce((acc, complement) => {
        acc[complement.name] = { quantity: 0, price: complement.price };
        return acc;
      }, {}) || {}
    );
    setObservation("");
  }, [item]); 


  // Estado para observações
  const [observation, setObservation] = useState("");

  // Bloqueia o scroll do fundo quando o modal é aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Função para converter preço em número
  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
    }
    if (typeof price === "number") {
      return price;
    }
    console.warn(`Preço inválido: ${price}`);
    return 0;
  };

  // Calcula o preço total (item principal + complementos)
  const calculatedPrice =
    (parsePrice(item.price) || 0) * quantity +
    Object.values(selectedComplements).reduce((acc, complement) => {
      const complementPrice = parsePrice(complement.price);
      return acc + complementPrice * complement.quantity;
    }, 0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleComplementChange = (complement, change) => {
    setSelectedComplements((prev) => {
      const newQuantity = (prev[complement.name]?.quantity || 0) + change;
      if (newQuantity < 0) return prev; // Impede quantidades negativas
      return {
        ...prev,
        [complement.name]: {
          quantity: newQuantity,
          price: complement.price,
        },
      };
    });
  };
  const handleAdd = useCallback((event) => {
    event.preventDefault();
    addToCart(item, quantity, selectedComplements);
    onClose();
  }, [item, quantity, selectedComplements, addToCart, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white w-full h-full relative overflow-y-auto">
        {/* Botão de Fechar */}
        <button
          className="absolute top-4 right-4 text-2xl p-1 bg-[#5252525b] rounded-full text-gray-500 z-30"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* Conteúdo do Modal */}
        <div className="relative max-w-2xl mx-auto text-left">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full mx-auto object-cover mb-4"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-[#212529]">
              {item.name}
            </h3>
            <p className="text-gray-600 text-base">{item.description}</p>
            <p className="font-semibold my-1 mb-6">{item.price}</p>
          </div>

          {/* Complementos */}
          <div className="p-3">
            <p className="font-semibold">Complementos</p>
            <p className="text-sm">Escolha até 13 opções</p>
            {item.complements?.map((complement, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-200 p-3"
              >
                <p className="text-gray-700 flex flex-col">
                  {complement.name}
                  <span>+ R$ {complement.price}</span>
                </p>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 text-2xl"
                    onClick={() => handleComplementChange(complement, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2 text-lg">
                    {selectedComplements[complement.name]?.quantity || 0}
                  </span>
                  <button
                    className="px-3 py-1 text-2xl"
                    onClick={() => handleComplementChange(complement, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Observações */}
          <div className="p-3 text-gray-400 text-sm mb-36">
            <span className="flex justify-between w-full">
              <p>Alguma observação?</p>
              <p>{observation.length}/500</p>
            </span>
            <textarea
              className="border-[1px] border-gray-200 w-full h-24 mt-2 p-2 rounded-sm focus:outline-none"
              maxLength="500"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Digite sua observação aqui"
            />
          </div>

          {/* Botão de Adicionar ao Carrinho */}
          <div className="bg-white h-20 px-6 fixed bottom-0 w-full">
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center">
                <button
                  className="px-3 py-1 text-2xl"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="mx-2 text-lg">{quantity}</span>
                <button
                  className="px-3 py-1 text-2xl"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="bg-[#181717] text-white px-4 py-3 rounded-sm font-semibold"
                onClick={handleAdd}
         
              >
                Adicionar R$ {calculatedPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
export default Modal;
