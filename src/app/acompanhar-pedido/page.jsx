"use client";
import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { BsHouses } from "react-icons/bs";
import { FaPix } from "react-icons/fa6";

const AcompanharPedido = () => {
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura dos itens
  const [progress, setProgress] = useState(0);
  const toggleList = () => {
    setIsOpen(!isOpen); // Alterna o estado de abertura
  };
  useEffect(() => {
    // Recupera os dados de completedOrder
    const completedOrder = JSON.parse(localStorage.getItem("completedOrder"));

    if (completedOrder) {
      const { cartItems, cartTotal, userData } = completedOrder;

      // Define os valores recuperados nos estados
      setPedido(cartItems);
      setTotal(cartTotal);
      setCliente(userData);
    }
  }, []); // Executa apenas uma vez quando o componente for montado

  if (!pedido || !cliente) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div className="flex flex-col justify-center items-center text-center bg-white ">
      <div
        className="flex justify-between 
    items-center p-4 bg-white w-full "
      >
        <IoIosArrowBack />
        <p>Detalhes do pedido</p>
        <IoClose />
      </div>
      <div className="flex flex-col w-[80%] border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center space-x-3 ">
          <div className="flex items-center gap-3">
            <span className="bg-green-700 w-4 h-4 flex rounded-full">
              <span></span>
            </span>
            <span className="text-left">
              <p className="text-gray-500">Status do pedido</p>
              <p className="font-medium">Aguardando confirmação</p>
            </span>
          </div>
          <span onClick={toggleList} className="cursor-pointer">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </div>
        {isOpen && (
          <div
            className={`transition-container ${
              isOpen ? "open" : ""
            } w-full flex mt-10`}
          >
            <div className="relative w-0.5 h-60 bg-gray-700 rounded-full ml-3">
              {/* Barra de progresso */}
              <div
                className="absolute top-0 w-full bg-gray-400 transition-all duration-100"
                style={{ height: `${progress}%` }}
              ></div>
              {/* Ícones de correto */}
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-green-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 25
                      ? "opacity-100 text-cyan-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "0%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-green-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 50
                      ? "opacity-100  text-cyan-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "33%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2 
                  bg-green-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 70
                      ? "opacity-100  text-cyan-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "66%" }}
              />
              <MdOutlineDone
                className={`absolute left-1/2 transform -translate-x-1/2
                  bg-green-600 rounded-full p-1 text-2xl transition-opacity ${
                    progress > 95
                      ? "opacity-100  text-cyan-400"
                      : "text-gray-300"
                  }`}
                style={{ top: "100%" }}
              />
            </div>
            <div className="text-left ml-6 gap-4 flex flex-col -mt-1">
              <span>
                <h1 className="font-semibold text-black">Pedido Recebido</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Estamos processando seu pedido...
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Preparando Pedido</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Seu pedido está sendo preparado.
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Pedido Pronto</h1>
                <p className="text-gray-600 mb-4 text-sm">
                  Seu pedido está pronto para ser retirado ou entregue.
                </p>
              </span>

              <span>
                <h1 className="font-semibold text-black">Pedido Entregue</h1>
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
          <h1 className="font-medium text-lg">Pedido n 24112442</h1>
          {pedido.map((item, index) => (
            <>
              <li
                key={index}
                className="flex justify-between px-5 mb-6 items-center mt-4 border-b border-gray-100 pb-4 "
              >
                <span className="font-xs text-center">
                  ({item.quantity}) {item.name}
                </span>
                <span>R$ {item.totalItemPrice}</span>
              </li>
              <div className="my-2 border-b border-gray-100">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>R$ {item.totalItemPrice}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-500">Taxa de entrega</p>
                  <p className="text-gray-500">R$ 23</p>
                </div>
                <div className="flex justify-between mb-6 font-semibold">
                  <p>Total</p>
                  <p>R$ {item.totalItemPrice}</p>
                </div>
              </div>
            </>
          ))}
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
                <p>
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
                <p className="text-gray-500">Pix / transferência</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcompanharPedido;
