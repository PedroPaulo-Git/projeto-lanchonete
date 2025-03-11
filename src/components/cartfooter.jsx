"use client";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import PaymentStatus from "./verifyPayment";
import MercadoPagoComponent from "./mercadopagocomponent";

export default function CartFooter({
  cartItems = [],
  onClearCart = () => {},
  // onContinue = () => {},
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  //const [status, setStatus] = useState('');
  
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

  // Cálculo do subtotal (item principal + complementos)
  const subtotal = cartItems.reduce((acc, item) => {
    // Preço do item principal
    const itemPrice = parsePrice(item.price);

    // Preço dos complementos
    const complementsPrice = Object.values(item.complements || {}).reduce(
      (acc, complement) => {
        const complementPrice = parsePrice(complement.price);
        return acc + complementPrice * complement.quantity;
      },
      0
    );

    // Preço total do item (item principal + complementos)
    const totalItemPrice = itemPrice * item.quantity + complementsPrice;

    return acc + totalItemPrice;
  }, 0);

  const deliveryFee = 0; // Taxa de entrega
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) return null;
 
  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cartItems.length === 1 ? cartItems[0].name : "Pedido múltiplo",
          unit_price: total, // Preço total do carrinho
        }),
      });

      const data = await response.json();
      console.log(data)
      if (data.init_point) {
        setPaymentId(data.id);
        setShowPaymentStatus(true);
        window.open(data.init_point, "_blank"); // Redireciona para pagamento
      } else {
        alert("Erro ao gerar pagamento.");
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
    }
  };

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
           {showPaymentStatus && <PaymentStatus paymentId={paymentId} />}
          <div className="bg-white w-full h-full overflow-y-auto">
            <div className="items-center justify-between text-center border-b-[1px] border-gray-200 p-3 py-4 flex">
              <h3 className="font-normal text-md text-[#212529] text-lg">
                Projeto lanchonete
             
              </h3>
             
              <button className="text-2xl" onClick={handleToggleCart}>
                <IoClose />
              </button>
              {/* <h3>Status do pagamento: {status}</h3> */}
            </div>
            <div className="border-b-[1px] py-4 px-3 justify-between flex items-center w-full border-gray-200">
              <span className="flex items-center text-lg gap-2">
                <FiMapPin />
                <p className="font-semibold text-sm">
                  Calcular taxa de entrega
                </p>
              </span>
              <IoIosArrowForward />
            </div>

            <div className="space-y-4 bg-gray-50 p-3 mb-20">
             
              <div className="flex justify-between items-center">
                <p className="font-semibold">Sua sacola</p>
                <p onClick={handleClearCart} className="text-xs">
                  LIMPAR
                </p>
              </div>
              {console.log("CART ITEMS", cartItems)}
              {cartItems.map((item, index) => {
                const itemPrice = parsePrice(item.price);
                const complementsPrice = Object.keys(
                  item.complements || {}
                ).reduce((acc, complementKey) => {
                  const complement = item.complements[complementKey];
                  const complementPrice = parsePrice(complement.price);
                  return acc + complementPrice * complement.quantity;
                }, 0);

                const totalItemPrice =
                  itemPrice * item.quantity + complementsPrice;

                return (
                  <div
                    key={index}
                    className="bg-white items-center gap-4 border-b border-gray-200 p-3 cursor-pointer space-y-2"
                  >
                    <div className="flex justify-between text-[#212529]">
                      <h3 className="font-semibold text-md text-[#212529]">
                        {item.quantity}x {item.name}
                      </h3>
                      <p className="font-semibold mt-1">
                        R$ {totalItemPrice.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      {item.complements &&
                        Object.keys(item.complements).length > 0 && (
                          <div>
                            {Object.keys(item.complements).map(
                              (complementKey, i) => {
                                const complement =
                                  item.complements[complementKey];
                                if (complement.quantity > 0) {
                                  // Só exibe complementos com quantidade maior que 0
                                  return (
                                    <div key={i} className="pb-2">
                                      <div className="flex justify-between">
                                        <div className="flex flex-col ">
                                          <span className="text-sm text-gray-500">
                                            {complement.quantity}x{" "}
                                            {complementKey}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null; // Não renderiza se a quantidade for 0
                              }
                            )}
                          </div>
                        )}

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 rounded-lg object-cover"
                      />
                    </div>
                    <span className="font-medium space-x-4">
                      <button className="text-red-800">Editar</button>
                      <button className="text-gray-500">Remover</button>
                    </span>
                  </div>
                );
              })}
            </div>
            <MercadoPagoComponent total={total}/>
            <div className="bg-white fixed w-full bottom-0 p-3 border-t-[1px] border-gray-100">
              <div className="my-2">
                <div className="flex justify-between mb-2">
                  <p>Subtotal</p>
                  <p>R$ {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Taxa de entrega</p>
                  <p className="text-gray-500">R$ {deliveryFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-6 font-semibold">
                  <p>Total</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
              </div>

              <div className="justify-between mt-4 flex flex-col">
                <button
                  className="bg-[#181717] text-white px-4 py-3 rounded-sm font-semibold"
                  onClick={handlePayment}
                >
                  Continuar Pedido
                </button>
                <button
                  onClick={handleClearCart}
                  className="text-gray-600 py-2 px-4 rounded-full text-sm"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
