import React, { useEffect } from "react";
import PixComponent from "./components/PixComponent"; // Supondo que o PixComponent esteja em outro arquivo
import CardComponent from "./components/CardComponent"; // Supondo que o CardComponent esteja em outro arquivo

const PaymentModal = ({ selectedPayment }) => {
  useEffect(() => {
    console.log(selectedPayment);
  }, [selectedPayment]); // Adiciona a dependência para o useEffect reagir quando selectedPayment mudar

  return (
    <div className="justify-center items-center h-screen">
      <div className="">
        {/* <button className="absolute top-2 right-2">X</button> */}
        {/* Condicional para renderizar o componente correto */}
        {selectedPayment === "pix" ? (
          <PixComponent selectedPayment={selectedPayment} /> // Exibe o PixComponent quando o pagamento for Pix
        ) : selectedPayment === "cartao" ? (
          <CardComponent /> // Exibe o CardComponent quando o pagamento for Cartão
        ) : (
          <p>Selecione um método de pagamento.</p> // Mensagem caso nenhum método tenha sido selecionado
        )}
        <div>
          {/* <button
            type="button"
            className={`flex justify-center my-4 w-[92%] mx-auto rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
              selectedPayment ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <p className="text-center ">Finalizar Pedido</p>
          </button> */}

          <h1></h1>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
