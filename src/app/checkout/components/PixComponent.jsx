import React, { useState } from "react";
import axios from "axios";

const PixComponent = ({selectedPayment}) => {
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);

  const handlePayment = async () => {
    try {
      const paymentData = {
        transaction_amount: 100, // Defina o valor correto
        token: "TOKEN_DO_CARTAO_OU_PIX",
        description: "Compra no site",
        installments: 1,
        payment_method_id: selectedPayment === "pix" ? "pix" : "visa", // Define dinamicamente
        payer: {
          email: "comprador@email.com",
          identification: {
            type: "CPF",
            number: "12345678900",
          },
        },
      };
  
      const response = await axios.post("http://localhost:5000/process_payment", paymentData);
      console.log(response.data);
      setQrCode(response.data.qr_code);
      setQrCodeBase64(response.data.qr_code_base64);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    }
  };
  

  return (
    <div>
      <h2>Pagamento via Pix</h2>
      <button onClick={handlePayment}>Gerar QR Code</button>

      {qrCode && (
        <div>
          <p>Escaneie o QR Code abaixo para pagar:</p>
          <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" />
          <p>Ou copie e cole no app do banco:</p>
          <code>{qrCode}</code>
        </div>
      )}
    </div>
  );
};

export default PixComponent;
