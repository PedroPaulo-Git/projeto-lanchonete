import { useState, useEffect } from "react";
import { IoClose } from 'react-icons/io5'; 
import Image from "next/image";
import WaitPaymentGif from '../assets/waitpayment.gif'


export default function PaymentStatus({paymentId}) {
    const [paymentStatus, setPaymentStatus] = useState("");
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentId) {
        console.log("Aguardando ID do pagamento...");
        return;
      }
  
      try {
        // Certifique-se de que paymentId está sendo passado corretamente
        const response = await fetch(`http://localhost:5000/payment-status?paymentId=${paymentId}`, {
          method: "GET", // Requisição GET
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) {
          throw new Error("Erro ao verificar status do pagamento");
        }
  
        const data = await response.json();
        setPaymentStatus(data.status); // Atualiza o estado com a resposta do backend
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
      }
    };
  
    if (paymentId) {
      checkPaymentStatus();
    }
  
    const interval = setInterval(() => {
      if (paymentId) {
        checkPaymentStatus();
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [paymentId]); // A dependência é o paymentId
  

  // Função para cancelar o pedido
  const handleCancelOrder = async () => {
    setPaymentStatus(null)
    window.location.reload();
    // if (!paymentId) {
    //   alert("ID do pagamento não encontrado.");
    //   return;
    // }
  
    // try {
    //   const response = await fetch("http://localhost:5000/cancel-order", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       paymentId: paymentId, // Passa o ID do pagamento
    //     }),
    //   });
  
    //   const data = await response.json();
    //   if (data.message) {
    //     alert(data.message);
    //   } else {
    //     alert("Erro ao cancelar pedido.");
    //   }
    // } catch (error) {
    //   console.error("Erro ao cancelar pedido:", error);
    //   alert("Erro ao cancelar pedido.");
    // }
  };
  


  return (
    <>
      {paymentStatus === "pending" ? (
        <div className="absolute w-screen z-40 flex items-center justify-center h-screen bg-gray-100 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <IoClose className="absolute top-3 right-3 text-2xl cursor-pointer" />
            <Image
              alt="Aguardando pagamento"
              src={WaitPaymentGif}
              className="w-16 h-16 mx-auto"
            />
            <p className="text-lg font-semibold mb-4">Aguardando pagamento...</p>

            <button
              onClick={handleCancelOrder}
              className="text-gray-600 py-2 px-4 rounded-full text-sm border-[1px] border-gray-400"
            >
              Cancelar Pedido
            </button>
          </div>
        </div>
      ) : paymentStatus === "approved" && (
        <div className="flex items-center justify-center h-screen bg-green-100">
          <p className="text-lg font-semibold text-green-700">Pagamento confirmado!</p>
        </div>
      )}
    </>
  );
}