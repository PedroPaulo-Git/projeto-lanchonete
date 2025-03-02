"use client";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({ item, onClose }) {
  if (!item) return null;
  const [selectedComplements, setSelectedComplements] = useState({});
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Bloqueia o scroll do fundo

    // Limpar a configuração de overflow quando o modal for fechado
    return () => {
      document.body.style.overflow = "auto"; // Restaura o scroll da página
    };
  }, []);

  const handleScroll = (e) => {
    const offset = e.target.scrollTop; // Obtém o scroll dentro do modal

    if (offset > 250) {
      setIsSticky(true); // Exibe o botão de fechar quando o scroll dentro do modal ultrapassar 10px
    } else {
      setIsSticky(false);
    }
  };
  const [quantity, setQuantity] = useState(0); // Quantidade do alimento principal

  // Função para aumentar ou diminuir a quantidade
  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(prevQuantity + change, 0)); // Impede quantidade negativa
  };

  // Calcular o preço total
  const totalPrice =
    item.price.replace("R$", "").trim().replace(",", ".") * 1 * quantity +
    Object.entries(selectedComplements).reduce(
      (acc, [complement, quantity]) => {
        const complementPrice =
          item.complements.find((c) => c.name === complement)?.price || 0;
        return acc + complementPrice * quantity;
      },
      0
    );

  // Função para adicionar/remover complementos
  const handleComplementChange = (complement, change) => {
    setSelectedComplements((prev) => {
      const newCount = (prev[complement] || 0) + change;
      if (newCount < 0) return prev; // Impede números negativos
      return { ...prev, [complement]: newCount };
    });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div
        className="bg-white w-full h-full relative overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Botão de Fechar */}
        <button
          className="absolute top-4 right-4 text-2xl p-1 bg-[#5252525b] rounded-full text-gray-500 z-30"
          onClick={onClose}
        >
          <IoClose />
        </button>

        {/* Conteúdo do Modal */}
        <div className=" relative max-w-2xl mx-auto text-left ">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full mx-auto object-cover mb-4"
          />
          <div className="w-full flex items-center bg-white sticky top-0 z-10">
            <div className="p-4">
              <h3
                className={`font-semibold text-md text-[#212529] text-lg ${
                  !isSticky ? "my-[-20px]" : ""
                }`}
              >
                {item.name}
              </h3>

              {isSticky && (
                <button
                  className="absolute top-4 right-4 text-2xl p-1 z-30"
                  onClick={onClose}
                >
                  <IoClose />
                </button>
              )}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-gray-600 text-base">{item.description}</p>
            <p className="font-semibold my-1 mb-6">{item.price}</p>
          </div>
          <div className="sticky-header bg-gray-200 inset-shadow-sm p-3 sticky top-14 w-full">
            <p className="font-semibold">ad.lanche (3)</p>
            <p className="text-sm">Escolha até 13 opções</p>
          </div>
          <div>
            <div className="mt-4 space-y-2 ">
              {item.complements?.map((complement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-200 p-3"
                >
                  <p className="text-gray-700 flex flex-col">
                    <span></span>
                    {complement.name}
                    <span className="">+ R$ {complement.price.toFixed(2)}</span>
                  </p>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 text-2xl"
                      onClick={() =>
                        handleComplementChange(complement.name, -1)
                      }
                    >
                      -
                    </button>
                    <span className="mx-2 text-lg">
                      {selectedComplements[complement.name] || 0}
                    </span>
                    <button
                      className="px-3 py-1 text-2xl"
                      onClick={() => handleComplementChange(complement.name, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className=" p-3 text-gray-400 text-sm mb-24">
                <span className="flex justify-between w-full">
                  <p>Alguma observação?</p>
                  <p>0/500</p>
                </span>

                <input
                  className="border-[1px] border-gray-200 w-full h-24 mt-2 rounded-sm"
                  type="text"
                  name=""
                  id=""
                />
              </div>
            </div>

            <div className="bg-white h-20 px-6 fixed bottom-0 w-full">
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  {/* Botão para diminuir a quantidade */}
                  <button
                    className="px-3 py-1 text-2xl"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </button>
                  {/* Exibindo a quantidade do alimento principal */}
                  <span className="mx-2 text-lg">{quantity}</span>
                  {/* Botão para aumentar a quantidade */}
                  <button
                    className="px-3 py-1 text-2xl"
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="bg-[#181717] text-white px-4 py-3 rounded-sm font-semibold "
                  onClick={() => alert("Adicionado ao carrinho!")} // Aqui você pode adicionar a lógica para o carrinho
                >
                  Adicionar R$ {totalPrice.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
