import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy } from "react-icons/fa";
import CopyPix from "./CopyPix";
import { FaSpinner } from "react-icons/fa";

const PixComponent = ({ selectedPayment }) => {
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showCopyPix, setShowCopyPix] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId,setPaymentId] = useState(null)



  const handleCopyClick = () => {
    // Copiar o QR Code para a área de transferência
    if (qrCode) {
      navigator.clipboard
        .writeText(qrCode)
        .then(() => {
          setShowCopyPix(true); // Exibe o componente de feedback
          setTimeout(() => {
            setShowCopyPix(false); // Esconde o componente após 3 segundos
          }, 3000);
        })
        .catch((err) => {
          console.error("Falha ao copiar para a área de transferência", err);
        });
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        console.log("Enviando requisição para:", `http://localhost:5000/payment_status?paymentId=${paymentId}`);

        const response = await axios.get(`http://localhost:5000/payment_status?paymentId=${paymentId}`);

  
        if (response.data.status === "approved") {
          window.location.href = "/success"; // Redireciona para a página de sucesso
        }
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
      }
    };
  
    if (qrCode) {
      const interval = setInterval(checkPaymentStatus, 5000); // Verifica a cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [qrCode]);
  
  // Função para formatar CPF no padrão XXX.XXX.XXX-XX
  const formatCPF = (cpf) => {
    if (!cpf) return "";
    cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for número
    if (cpf.length !== 11) return cpf; // Se não tiver 11 dígitos, retorna como está
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const handlePayment = async () => {
    if (!userData) {
      console.error("Nenhum dado de usuário encontrado.");
      return;
    }

    const formattedCPF = formatCPF(userData.cpf);

    try {
      setIsLoading(true);
      console.log(userData.email)
      console.log(userData)
      const paymentData = {
        transaction_amount: 0.01, // Defina o valor correto
        token: "TEST-416333787685811-030510-e95be0b60348ecf7473d8cd21aaf5e12-290240028",
        description: "Compra no site",
        installments: 1,
        payment_method_id: selectedPayment === "pix" ? "pix" : "visa", // Define dinamicamente
        payer: {
          email: userData.email,
          identification: {
            type: "CPF",
            number: formattedCPF,
          },
        },
      };
      
      console.log(paymentData.payer.email);
      console.log(paymentData);
     
      const response = await axios.post(
        "http://localhost:5000/process_payment",
        paymentData
      );

      setPaymentId(response.data.id);
      console.log("ID DO PAGAMENTO >>>>>>>>> ",response.data.id);
      console.log(response.data);
      console.log(response);
      setQrCode(response.data.qr_code);
      setQrCodeBase64(response.data.qr_code_base64);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto text-center p-4 pt-10 flex flex-col h-screen">
      {showCopyPix && (
        <div className="fixed top-0 left-0 right-0 p-4 text-white text-center">
          <CopyPix />
        </div>
      )}
      <h1 className="font-semibold text-2xl">Finalize seu pagamento</h1>
      <h2 className="font-semibold">Pagamento via Pix</h2>
      {/* <button onClick={handlePayment}>Gerar QR Code</button> */}

      {!qrCode && (
        <div>
          <button
            type="button"
            className={`flex justify-center my-4 mx-auto rounded-lg w-40 h-10 font-medium text-white sm:w-auto ${
              selectedPayment ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handlePayment}
            // disabled={isLoading || qrCode} // Desabilita o botão enquanto o QR code é gerado ou já foi gerado
          >
            <div className="text-center flex items-center">
              {/* Exibe o spinner ou o texto dependendo do estado de isLoading */}
              {isLoading ? (
                <FaSpinner className="animate-spin text-white" />
              ) : (
                "Gerar QR Code"
              )}
            </div>
          </button>
        </div>
      )}

      {/* {isLoading && !qrCode && (
        <div className="flex justify-center my-4 mx-auto rounded-lg px-5 py-3 font-medium text-white sm:w-auto">
          <FaSpinner className="animate-spin text-white" />
        </div>
      )} */}

      {qrCode && (
        <div>
          <p className="">Escaneie o QR Code abaixo para pagar:</p>
          {qrCodeBase64 && (
            <img
              className="mx-auto my-4"
              src={`data:image/png;base64,${qrCodeBase64}`}
              alt="QR Code Pix"
            />
          )}

          <p>Ou copie e cole no app do banco:</p>

          <div className="relative mt-4 mx-auto p-2 max-w-screen overflow-x-auto overflow-y-hidden whitespace-nowrap border border-gray-400 rounded-sm">
            <code className="max-w-full  ">{qrCode}</code>
            {/* <span
              onClick={handleCopyClick}
              className="absolute right-0 overflow-hidden bg-[#f8f9fa] h-8 w-10 flex justify-center items-center "
            >
              <button>
                <FaCopy className="mx-auto" />
              </button>
            </span> */}
          </div>

          <button
            type="button"
            className={`flex justify-center my-4 mx-auto rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
              selectedPayment ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <div onClick={handleCopyClick} className="text-center flex items-center">
              Copiar Pix{" "}
                <FaCopy className="ml-2" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default PixComponent;
