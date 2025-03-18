"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { BsHouses } from "react-icons/bs";
import { FaPix } from "react-icons/fa6";
import { IoIosRefresh } from "react-icons/io";
import { useRouter } from "next/navigation";

import BlinkGif from '../../assets/BlinkGif.gif'

const AcompanharPedido = () => {
  const [pedido, setPedido] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura dos itens
  const [progress, setProgress] = useState(0);
   const router = useRouter();
  const toggleList = () => {
    setIsOpen(!isOpen); // Alterna o estado de abertura
  };
  useEffect(() => {
    const completedOrder = JSON.parse(localStorage.getItem("completedOrder"));
    console.log("Dados recuperados do localStorage:", completedOrder);

    if (completedOrder && completedOrder.cartItems) {
      setTimeout(() => {
        setPedido(completedOrder.cartItems);
        setTotal(completedOrder.cartTotal);
        setCliente(completedOrder.userData);
      }, 100); // Atrasando a atualização para garantir que a renderização ocorra depois
    }
  }, []);

  useEffect(() => {
    console.log("Pedido no estado atualizado:", pedido);
  }, [pedido]); // Executa sempre que 'pedido' mudar

  const handleGoHome = () => {
    router.push("/");
    document.body.style.overflow = "auto";
 
  };

  if (!pedido || !cliente) return <div className="flex h-screen items-center justify-center">
  <IoIosRefresh className="animate-spin text-4xl text-gray-600" />
</div>;

  return (
    <div className="flex h-screen flex-col items-center text-center bg-white ">
      <div
        className="flex justify-between 
    items-center p-4 bg-white w-full "
      >
        <IoIosArrowBack onClick={handleGoHome} />
        <p>Detalhes do pedido</p>
        <span></span>
      </div>
      <div className="flex flex-col w-[80%] border-b border-gray-100 pb-4">
        <div  onClick={toggleList} className="flex justify-between items-center space-x-3 ">
          <div className="flex items-center gap-3">
            <span className="bg-green-700 w-4 h-4 flex rounded-full">
              <span>
                <Image
                src={BlinkGif}
                alt="blink"
                className=""/>
              </span>
            </span>
            <span className="text-left">
              <p className="text-gray-500">Status do pedido</p>
              <p className="font-medium">Aguardando confirmação</p>
            </span>
          </div>
          <span className="cursor-pointer">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </div>
        {isOpen && (
          <div
            className={`transition-container ${
              isOpen ? "open" : ""
            } w-full flex mt-10`}
          >
            <div className="relative w-0.5 h-60 bg-gray-600 rounded-full ml-3">
              {/* Barra de progresso */}
              <div
                className="absolute top-0 w-full bg-gray-400 
                transition-all duration-100"
                style={{ height: `${progress}%` }}
              ></div>
              {/* Ícones de correto */}
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-green-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 25
                      ? "opacity-100 text-green-400"
                      : "text-green-300"
                  }`}
                style={{ top: "0%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-gray-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 50
                      ? "opacity-100  text-green-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "33%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2 
                  bg-gray-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 70
                      ? "opacity-100  text-green-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "66%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-gray-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 95
                      ? "opacity-100  text-green-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "100%" }}
              />
            </div>
            <div className="text-left ml-6 gap-4 flex flex-col -mt-1">
              <span>
                <h1 className="font-semibold text-black">Pedido recebido</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Estamos processando seu pedido...
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Preparando pedido</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Seu pedido está sendo preparado.
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Pedido pronto</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Seu pedido está pronto para ser entregue.
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Pedido entregue</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Seu pedido foi entregue com sucesso. Agradecemos pela
                  preferência!
                </p>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="px-8 w-full pb-10">
        <div className="mt-6 text-left">
          {pedido && pedido.length > 0 ? (
            pedido.map((item, index) => (
              <div key={item.id}>
                <h1 className="font-medium text-lg">Pedido nº {item.id.split('-')[1]}</h1>

                <li className="mb-6  pb-4 list-none">
                  <div className="flex justify-between px-5 items-center py-3 mt-5 border-y border-gray-100">
                    <span className="font-xs text-center">
                      {item.quantity}x | {item.name}
                    </span>
                    <span>R$ {item.totalItemPrice.toFixed(2)}</span>
                  </div>

                  <div className="my-2 border-b border-gray-100">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>R$ {item.totalItemPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-500">Taxa de entrega</p>
                      <p className="text-gray-500">R$ 4.00</p>
                    </div>
                    <div className="flex justify-between mb-6 font-semibold">
                      <p>Total</p>
                      <p>R$ {total}</p>
                    </div>
                  </div>
                </li>
              </div>
            ))
          ) : (
            <p>Nenhum item no pedido.</p>
          )}

          <div className=" pt-4">
            <h1 className="font-medium">Informações do cliente</h1>
            <div className="flex items-center gap-3 bg-white rounded-sm p-2 text-gray-700 mt-2">
              <FaRegUser />
              <span className="">
                <p className="font-medium"> {cliente.name}</p>
                <p>{cliente.phone}</p>
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-sm p-2 text-gray-700 mt-2">
              <BsHouses />
              <span className="">
                <p className="font-medium">
                  {cliente.address.street}, {cliente.address.number}
                </p>
              </span>
            </div>
          </div>

          <div className="pt-4">
            <p className="font-semibold">Pagamento</p>
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 text-gray-700 mt-2 ">
              <FaPix />
              <span className="">
                <p className="text-gray-500">Pix</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcompanharPedido;
