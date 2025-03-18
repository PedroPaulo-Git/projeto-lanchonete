"use client"; // Garante que o componente é renderizado no lado do cliente

import { useState, useEffect } from "react";
//import { useSearchParams } from "next/navigation";
//import MercadoPagoComponent from "@/components/mercadopagocomponent";
import { InputMask } from "@react-input/mask";
import HeaderCheckout from "./header";
import ModalAddress from "@/components/modals/modalAddress";
import PaymentModal from "./paymentModal";
import Footer from "@/components/footer";
import ErrorPopupCartao from "./components/ErrorPopupCartao";
import ErrorPopupCPF from "./components/ErrorPopupCPF";

import { FiMapPin } from "react-icons/fi";
import { CiClock2 } from "react-icons/ci";
import { FaPix } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { BsHouses } from "react-icons/bs";
import { useCart } from "../context/contextComponent";

import { FaRegUser } from "react-icons/fa";
import AddressNotSavePopUp from "./addressNotSavePopUp";
import CartFooter from "../../components/cartfooter";
export default function CheckoutPage() {
  const {
    cartItems,
    setmodalAddressOpen,
    modalAddressOpen,
    savedAddress,
    setSavedAddress,
  } = useCart();
  const [cartValueTotal, setcartValueTotal] = useState(0); // Total final
  const [cartSubtotal, setCartSubtotal] = useState(0); // Subtotal do carrinho
  const deliveryFee = 4; 

  const [step, setStep] = useState(1); // Controla a etapa atual do checkout
  const [showPopUp, setShowPopUp] = useState(false);
  const [showPopUpErrorCartao, setShowPopUpErrorCartao] = useState(false);
  const [showPopUpErrorCPF, setShowPopUpErrorCPF] = useState(false);
  const [cpfIsValid, setCpfIsValid] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userAddressNumber, setUserAddressNumber] = useState("");
  const [userCpf, setUserCpf] = useState("");

  const [progress, setProgress] = useState(10);

  const handleSelect = (method) => {
    setSelectedPayment(method);
    console.log(selectedPayment);
  };

  const validateCpf = (cpf) => {
    // Remover qualquer caractere não numérico
    cpf = cpf.replace(/\D/g, "");

    // Verifica se o CPF possui 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica CPF com todos os dígitos iguais (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Valida o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    firstDigit = firstDigit >= 10 ? 0 : firstDigit;

    // Valida o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    secondDigit = secondDigit >= 10 ? 0 : secondDigit;

    // Verifica se os dígitos verificadores estão corretos
    return cpf.charAt(9) == firstDigit && cpf.charAt(10) == secondDigit;
  };

  const handleCpfChange = (event) => {
    let value = event.target.value;

    // Remove caracteres não numéricos
    let cleanCpf = value.replace(/\D/g, "");

    // Aplica a máscara manualmente (CPF) para exibição no input
    if (cleanCpf.length <= 11) {
      value = cleanCpf.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    setUserCpf(value); // Define a versão formatada para exibição no input

    // Recupera os dados do localStorage, ou um objeto vazio se não houver dados
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Atualiza apenas o CPF no localStorage sem pontos e traço
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, cpf: cleanCpf })
    );

    // Verifica a validade do CPF usando a versão sem formatação
    if (validateCpf(cleanCpf)) {
      console.log("CPF Válido");
      setShowPopUpErrorCPF(false);
      setCpfIsValid(true);
    } else {
      console.log("CPF Inválido");
      //setShowPopUpErrorCPF(true);
      setCpfIsValid(false);
    }
  };

  const handlePayment = () => {
    console.log(userCpf);
    if (userCpf === "" || !userCpf || !cpfIsValid) {
      setShowPopUpErrorCPF(true);
      setTimeout(() => {
        setShowPopUpErrorCPF(false);
      }, 2000);
    } else if (userCpf && cpfIsValid) {
      setIsPaymentModalOpen(true);
    }
  };

  const handleToggleAddress = () => {
    setmodalAddressOpen(true);
    document.body.style.overflowY = "hidden";
    if (!modalAddressOpen) {
      document.body.style.overflow = "auto"; // Restore scroll
    }
  };

  const handleNextStep = () => {
    console.log("pagamento selecionado :", selectedPayment);

    if (selectedPayment == "cartao") {
      setShowPopUpErrorCartao(true);
      setTimeout(() => {
        setShowPopUpErrorCartao(false);
      }, 2000);
    } else {
      console.log(step);
      if (step > 2) {
        setProgress(100);
      }
      if (!savedAddress) {
        setShowPopUp(true);
        setTimeout(() => setShowPopUp(false), 3000); // Esconde o popup após 3 segundos
      } else if (step === 1) {
        setProgress(50);
        setStep((prevStep) => prevStep + 1);
      } else if (step === 2) {
        setProgress(100);
        setStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setProgress(10);
      setStep((prevStep) => prevStep - 1);
    } else if (step === 3) {
      setProgress(50);
      setStep((prevStep) => prevStep - 1);
    }
    // if (step > 1) {
    //   setStep((prevStep) => prevStep - 1);
    //   setProgress(prev => Math.min(prev - 33, 100));
    // }
  };

  // useEffect(() => {
  //   console.log("Forma de pagamento selecionada:", selectedPayment);
  //   console.log("MODAL ADDRESS OPEN:", modalAddressOpen);
  // }, [selectedPayment, modalAddressOpen]);

  // useEffect(() => {}, []);

  useEffect(() => {
    const updateUserData = () => {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (userData) {
        if (userData.address) {
          setSavedAddress(userData.address);
          setUserAddress(userData.address.street);
          setUserAddressNumber(userData.address.number);
        }
        if (userData.cpf) setUserCpf(userData.cpf);
        if (userData.name) setUserName(userData.name);
        if (userData.phone) setUserPhone(userData.phone);
      }
    };

    updateUserData(); // Atualiza os dados na montagem

    const handleStorageChange = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUserAddress, setUserAddressNumber, userAddress, userAddressNumber]);

  // const deliveryFee = 4;
  // const total = cartTotal + deliveryFee;

  useEffect(() => {
    const cartTotal = localStorage.getItem("cartTotal");
  
    // Função para garantir que o valor seja um número válido
    const parsePrice = (price) => {
      if (typeof price === "string") {
        // Remove "R$", espaços e substitui vírgulas por pontos
        price = price.replace("R$", "").trim().replace(",", ".");
        // Converte para número de ponto flutuante
        return parseFloat(price);
      }
      if (typeof price === "number") {
        return price;
      }
      console.warn(`Preço inválido: ${price}`);
      return 0;
    };
  
    console.log("Valor de cartTotal (do localStorage):", cartTotal);
    
    const parsedCartTotal = parsePrice(cartTotal); // Converte o valor para número
    console.log("Valor convertido para float:", parsedCartTotal);
  
    // Garantir que a taxa de entrega também seja um número
    const deliveryFeeNumber = parseFloat(deliveryFee);
  
    // Definir o subtotal e o total final
    const subtotal = parsedCartTotal;
    const total = subtotal  // Soma correta
    console.log("Subtotal:", subtotal);
    console.log("Total (com taxa de entrega):", total);
  
    if (isNaN(total)) {
      console.error("Total do carrinho inválido no localStorage:", cartTotal);
    } else {
      setCartSubtotal(subtotal - 4);  // Atualiza o subtotal
      setcartValueTotal(total);  // Atualiza o total com a taxa de entrega
    }
  }, []);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    // Função para verificar o tamanho da tela
    const checkScreenSize = () => {
      if (window.innerHeight < 500) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    // Verifique o tamanho da tela quando o componente for montado
    checkScreenSize();

    // Adiciona o ouvinte de evento de redimensionamento da janela
    window.addEventListener("resize", checkScreenSize);

    // Limpeza do evento ao desmontar o componente
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Etapa 1: Local de entrega
  const renderDeliveryStep = () => (
    <div className="p-4  overflow-auto ">
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
                    <p>R$4,00</p>
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
              Informar endereço
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
              <p>R$4,00</p>
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
      {showPopUpErrorCartao && (
        <>
          <ErrorPopupCartao />
        </>
      )}

      <div className="p-4  h-screen overflow-auto pb-80">
        <h2 className="text-xl font-bold mb-4 ml-2 text-gray-700">
          Escolha a forma de pagamento
        </h2>
        <div className="space-y-3">
          {[
            { method: "pix", icon: <FaPix />, label: "Pix " },
            { method: "cartao", icon: <FaCreditCard />, label: "Cartão" },
          ].map(({ method, icon, label }) => (
            <div
              key={method}
              className={`flex items-center text-gray-700 gap-2 p-6 border rounded-xl bg-white shadow-inner cursor-pointer transition-all duration-200 ${
                selectedPayment === method
                  ? "border-[1px] border-gray-800"
                  : "border-gray-200"
              }`}
              onClick={() => handleSelect(method)}
            >
              {icon} <p>{label}</p>
              {selectedPayment === method && (
                <span className=" ml-auto w-[15px] h-[15px] bg-gray-950 rounded-full flex justify-center items-center">
                  <span className="w-[5px] h-[5px] bg-white rounded-full">
                    .
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
        {selectedPayment && (
          <div>
            <button
              onClick={handleNextStep}
              type="button"
              disabled={!selectedPayment}
              className={`inline-block w-[92%] absolute bottom-40 rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
                selectedPayment ? "bg-black" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
      <CartFooter />
      <Footer />
    </div>
  );

  // Etapa 3: Conclusão
  const renderConfirmationStep = () => (
    <div
      className={`my-div ${
        isSmallScreen
          ? "pb-80 overflow-auto h-screen"
          : " overflow-auto h-screen "
      }`}
    >
      <div>
        {showPopUpErrorCPF && (
          <div>
            <ErrorPopupCPF />
          </div>
        )}

        <div className="text-center border-b border-gray-200 mt-4">
          <p>Previsão para entrega</p>
          <h2 className="text-xl font-extrabold mb-4">22:07 - 22:22</h2>
        </div>
        <div className={`my-div ${isSmallScreen ? "" : "pb-80"}`}>
          <div className="p-2">
            <p className="font-semibold py-2">informações para entrega</p>
            <div className="flex items-center gap-3 bg-white rounded-sm px-2 text-gray-700 mt-2">
              <FaRegUser />
              <span className="">
                <p className="font-medium">{userName}</p>
                <p>{userPhone}</p>
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-sm p-2 text-gray-700 mt-2">
              <BsHouses />
              <span className="">
                <p className="font-medium">
                  {savedAddress.street},{savedAddress.number}
                </p>
              </span>
            </div>
          </div>
          <div className="px-2">
            <p className="font-semibold mt-4">Detalhes do pedido</p>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-white rounded-sm p-2 text-gray-700 mt-2"
                >
                  <p>{item.quantity}x</p>
                  <span className="flex justify-between w-full">
                    <p className="font-medium">{item.name}</p>
                    <p className="ml-auto">
                      R${item.totalItemPrice.toFixed(2)}
                    </p>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-2">Seu carrinho está vazio.</p>
            )}
            <p className="font-semibold mt-4">Total: R${cartValueTotal}</p>
          </div>
          <div>
           <div className="my-6 border-y border-gray-100 bg-white p-2 py-4">
    <div className="flex justify-between">
      <p>Subtotal</p>
      <p>R${cartSubtotal.toFixed(2)}</p> {/* Exibe o subtotal com 2 casas decimais */}
    </div>
    <div className="flex justify-between mb-2">
      <p className="text-gray-500">Taxa de entrega</p>
      <p className="text-gray-500">R${deliveryFee.toFixed(2)}</p> {/* Exibe a taxa de entrega com 2 casas decimais */}
    </div>
    <div className="flex justify-between font-semibold">
      <p>Total</p>
      <p>R${cartValueTotal.toFixed(2)}</p> {/* Exibe o total final com 2 casas decimais */}
    </div>
  </div>
          </div>
          <div className="px-2">
            <p className="font-semibold">Pagamento</p>
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 text-gray-700 mt-2 ">
              <FaPix />
              <span className="">
                <p className="text-gray-500">Pix / transferência</p>
              </span>
            </div>
          </div>
          <div className="px-2 pt-10">
            <p className="font-semibold ml-1">CPF/CNPJ</p>
            <input
              type="text"
              value={userCpf}
              onChange={handleCpfChange}
              className="border w-full p-2 rounded-lg border-gray-200 bg-white mt-2"
              placeholder="Digite o CPF"
              maxLength={14}
            />
          </div>
        </div>
        <div className="fixed bottom-0 w-full bg-white">
          <button
            onClick={handlePayment}
            type="button"
            disabled={!savedAddress}
            className={`flex justify-center my-4 w-[92%] mx-auto rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
              savedAddress ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <p className="text-center ">Finalizar Pedido</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      {isPaymentModalOpen ? (
        <PaymentModal selectedPayment={selectedPayment} />
      ) : (
        <div>
          {showPopUp && <AddressNotSavePopUp />}
          {modalAddressOpen ? (
            <>
              <ModalAddress setmodalAddressOpen={setmodalAddressOpen} />
            </>
          ) : (
            <>
              <HeaderCheckout
                progress={progress}
                handlePreviousStep={handlePreviousStep}
              />
              {step === 1 && renderDeliveryStep()}
              {step === 2 && renderPaymentStep()}
              {step === 3 && renderConfirmationStep()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
