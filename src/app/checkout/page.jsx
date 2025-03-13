"use client"; // Garante que o componente é renderizado no lado do cliente

import { useState, useEffect } from "react";
//import { useSearchParams } from "next/navigation";
//import MercadoPagoComponent from "@/components/mercadopagocomponent";
import HeaderCheckout from "./header";
import ModalAddress from "@/components/modals/modalAddress";
import Footer from "@/components/footer";
import { FiMapPin } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";
import { MdDeliveryDining } from "react-icons/md";
import { useCart } from "../context/contextComponent";
import AddressNotSavePopUp from "./addressNotSavePopUp";
import CartFooter from "../../components/cartfooter";
export default function CheckoutPage() {
  const {
    setmodalAddressOpen,
    modalAddressOpen,
    savedAddress,
    setSavedAddress,
  } = useCart();
  const [cartValueTotal, setcartValueTotal] = useState(0);
  const [step, setStep] = useState(1); // Controla a etapa atual do checkout
  const [showPopUp, setShowPopUp] = useState(false);

  const handleToggleAddress = () => {
    setmodalAddressOpen(true);
    console.log(modalAddressOpen);

    if (!modalAddressOpen) {
      document.body.style.overflow = "auto"; // Restore scroll
    }
  };

  const handleNextStep = () => {
    if (!savedAddress) {
      setShowPopUp(true);
      setTimeout(() => setShowPopUp(false), 3000); // Esconde o popup após 3 segundos
    } else {
      setStep(2);
    }
  };

  useEffect(() => {
    const cartTotal = localStorage.getItem("cartTotal");

    // Verificar se o valor recuperado é um número válido
    const total = parseFloat(cartTotal);
    if (isNaN(total)) {
      console.error("Total do carrinho inválido no localStorage:", cartTotal);
      // Definir um valor padrão, se necessário
      // Você pode optar por redirecionar ou mostrar uma mensagem de erro
    } else {
      console.log("Total do carrinho:", total);
      setcartValueTotal(total);
    }
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.address) {
      setSavedAddress(userData.address);
    } else {
      console.log("not saved");
    }

    const handleStorageChange = () => {
      const updatedUserData = JSON.parse(localStorage.getItem("userData"));
      if (updatedUserData?.address) setSavedAddress(updatedUserData.address);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Etapa 1: Local de entrega
  const renderDeliveryStep = () => (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Confirmar endereço</h2>
      <form>
        {savedAddress ? (
          // Se já houver um endereço salvo, exibe os detalhes
          <div className="p-6 w-full flex items-center justify-between border border-gray-500 rounded-xl bg-white mb-10">
            <div className="flex flex-col w-full">
              <span className="space-y-5">
                <div className="flex gap-3 items-center justify-between w-full">
                  <div className="flex  gap-3">
                    <MdDeliveryDining className="font-bold text-2xl" />

                    <span className="flex flex-col">
                      <p className="text-sm font-semibold">
                        Receber no seu endereço
                      </p>
                      {savedAddress.street},{savedAddress.number}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ">
                    <p>PRICE</p>
                    <span className="w-[20px] h-[20px] bg-gray-950 rounded-full flex justify-center items-center">
                      <span className="w-[10px] h-[10px] bg-white rounded-full">
                        .
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <CiClock2 className="font-bold text-2xl" />

                  <div className="flex gap-4">
                    <span className="flex flex-col">
                      <p className="text-sm font-semibold">Tempo estimado</p>
                      <p className="text-gray-500 font-semibold00">60-75 min</p>
                    </span>
                  </div>
                </div>
              </span>
            </div>
            {/* <p className="font-semibold text-sm">
              {`${savedAddress.street}, Nº ${savedAddress.number}, ${savedAddress.neighborhood}, ${savedAddress.address}`}
            </p> */}
          </div>
        ) : (
          // Se não houver endereço salvo, exibe a opção de calcular taxa
          <span className="flex items-center text-lg gap-2 bg-white p-4 rounded-xl border shadow-inner mb-5">
            <FiMapPin />
            <p onClick={handleToggleAddress} className="font-semibold text-sm">
              Calcular taxa de entrega
            </p>
          </span>
        )}
        <div>
          <p className="text-lg font-semibold mb-4">Quando deseja receber ?</p>
          <div className="p-6 w-full flex items-center justify-between border border-gray-500 rounded-xl bg-white ">
            <div className="flex gap-4">
              <CiClock2 className="font-bold text-2xl" />
              <span className="flex flex-col">
                <p className="text-sm font-semibold">Pedido para agora</p>
                <p className="text-gray-500 font-semibold00">60-75 min</p>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p>PRICE</p>
              <span className="w-[20px] h-[20px] bg-gray-950 rounded-full flex justify-center items-center">
                <span className="w-[10px] h-[10px] bg-white rounded-full">
                  .
                </span>
              </span>
            </div>
          </div>
        </div>
        {!modalAddressOpen && (
          <div>
            <button
              onClick={handleNextStep}
              type="button"
              disabled={!savedAddress}
              className={`inline-block w-[92%] absolute bottom-10 rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
                savedAddress ? "bg-black" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Próximo
            </button>
          </div>
        )}
      </form>
    </div>
  );

  // Etapa 2: Pagamento
  const renderPaymentStep = () => (
    <div className="">
      <div className="p-3">
      <h2 className="text-xl font-bold mb-4 ml-2 text-gray-700">Escolha a forma de pagamento</h2>
      <div className="space-y-3">
        <span className="flex  text-gray-700 gap-2 p-6 border border-gray-200 rounded-xl bg-white shadow-inner"><CiClock2 className="font-bold text-2xl" /> <p>Pix / transferência</p></span>
        <span className="flex text-gray-700 gap-2 p-6 border border-gray-200 rounded-xl bg-white shadow-inner"><CiClock2 className="font-bold text-2xl" /> <p className="">Cartão</p></span>
      
      </div>
      </div>
      {/* <MercadoPagoComponent />  */}
      {/* <button
        type="button"
        onClick={() => setStep(3)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Concluir Pedido
      </button> */}
      <CartFooter />
      <Footer />
    </div>
  );

  // Etapa 3: Conclusão
  const renderConfirmationStep = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pedido concluído!</h2>
      <p>Obrigado por comprar conosco.</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {showPopUp && <AddressNotSavePopUp />}
      {modalAddressOpen && (
        <>
          <ModalAddress setmodalAddressOpen={setmodalAddressOpen} />
        </>
      )}
      <HeaderCheckout />
      {step === 1 && renderDeliveryStep()}
      {step === 2 && renderPaymentStep()}
      {step === 3 && renderConfirmationStep()}
    </div>
  );
}
