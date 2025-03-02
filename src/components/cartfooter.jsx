"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
export default function CartFooter({
  cartItems,
  //totalPrice,
  onClearCart,
  onContinue,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleToggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      setScrollPosition(window.scrollY);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      window.scrollTo(0, scrollPosition);
    }
  };

  const handleClearCart = () => {
    onClearCart();
    setIsCartOpen(false);
    document.body.style.overflow = "auto";
    window.scrollTo(0, scrollPosition);
  };

  // Verificação e conversão para garantir que o valor de price seja numérico
  const getPriceValue = (price) => {
    const numericPrice = parseFloat(price.replace("R$", "").replace(",", "."));
    return isNaN(numericPrice) ? 0 : numericPrice; // Retorna 0 se o preço não for válido
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = getPriceValue(item.price);
    const quantity = item.quantity ? item.quantity : 0; // Garante que a quantidade é um número
    return acc + price * quantity;
  }, 0);

  const deliveryFee = 0; // Taxa de entrega
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) return null;

  return (
    <>
      <div className="z-20 fixed bottom-20 left-0 w-full bg-[#181717] text-white p-4 flex justify-between items-center">
        <p className="text-sm font-semibold">{cartItems.length} item(s)</p>
        <button onClick={handleToggleCart} className="text-sm font-semibold">
          Ver sacola
        </button>
        <p className="text-sm font-semibold">R$ {total.toFixed(2)}</p>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white w-full h-full overflow-y-auto">
            <div className="items-center justify-between text-center border-b-[1px] border-gray-200 p-3 py-4 flex">
              <h3
                className={`font-normal text-md text-[#212529] text-lg 
                           `}
              >
                Projeto lanchonete
              </h3>

              <button className="text-2xl" onClick={handleToggleCart}>
                <IoClose />
              </button>
            </div>
            <div className="border-b-[1px]  py-4 px-3 justify-between flex items-center w-full border-gray-200 ">
              <span className="flex items-center text-lg gap-2">
                <FiMapPin />
                <p className="font-semibold text-md">
                  Calcular taxa de entrega
                </p>
              </span>
              <IoIosArrowForward />
            </div>
            <div className="space-y-4">
              {cartItems.map((item, index) => {
                const price = getPriceValue(item.price);
                const totalItemPrice = price * (item.quantity || 1); // Garante que a quantidade é ao menos 1
                return (
                  <div key={index} className="flex justify-between">
                    <p>
                      {item.name} x{item.quantity}
                    </p>
                    <p>R$ {totalItemPrice.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>R$ {subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Taxa de entrega</p>
                <p>R$ {deliveryFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-4 font-semibold">
                <p>Total</p>
                <p>R$ {total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white py-2 px-4 rounded-full"
              >
                Limpar Carrinho
              </button>
              <button
                onClick={onContinue}
                className="bg-green-500 text-white py-2 px-4 rounded-full"
              >
                Continuar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
