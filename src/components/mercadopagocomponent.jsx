import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

const MercadoPagoComponent = ({ total }) => {
  const mercadoPagoRef = useRef(null);
  const cardFormRef = useRef(null); 
  useEffect(() => {
    if (total === undefined || isNaN(total)) {
      console.error("O valor do total é inválido:", total);
      return;
    }
    console.log(total);

    // Função para inicializar o Mercado Pago
    const initializeMercadoPago = () => {
      if (!mercadoPagoRef.current && window.MercadoPago) {
        // 1. Inicializa o Mercado Pago
        mercadoPagoRef.current = new window.MercadoPago(
          "TEST-eaffcadf-4756-4ee2-8af1-b24d1c68e8b3", // Substitua pela SUA chave pública
          { locale: "pt-BR" }
        );

        // 2. Configura o formulário de pagamento
        cardFormRef.current = mercadoPagoRef.current.cardForm({
          amount: total.toString(),
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Número do cartão",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "Código de segurança",
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Titular do cartão",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Banco emissor",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: "Parcelas",
            },
            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: "Tipo de documento",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Número do documento",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "E-mail",
            },
          },
          callbacks: {
            onFormMounted: (error) => {
              if (error) {
                console.warn("Form Mounted handling error: ", error);
                return;
              }
              console.log("Form mounted");
            },
            onSubmit: (event) => {
              event.preventDefault();
           
              if (cardFormRef.current) {
                const {
                  paymentMethodId: payment_method_id,
                  issuerId: issuer_id,
                  cardholderEmail: email,
                  amount,
                  token,
                  installments,
                  identificationNumber,
                  identificationType,
                } = cardFormRef.current.getCardFormData();

              // Envia os dados do pagamento para o backend
              const idempotencyKey = uuidv4();
              console.log("Idempotency Key gerado:", idempotencyKey);
              fetch("http://localhost:5000/process_payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Idempotency-Key": idempotencyKey,
                },
                body: JSON.stringify({
                  token,
                  issuer_id,
                  payment_method_id,
                  transaction_amount: Number(amount),
                  installments: Number(installments),
                  description: "Compra no site",
                  payer: {
                    email,
                    identification: {
                      type: identificationType,
                      number: identificationNumber,
                    },
                  },
                }),
              })
              .then((response) => {
                console.log("Resposta bruta:", response);
                
                if (!response.ok) {
                  return response.json().then(err => Promise.reject(err));
                }
                
                return response.json();
              })
              .then((data) => {
                if (data.qr_code) {
                  console.log("Pagamento realizado com sucesso:", data);
                  // Lógica para mostrar QR code
                } else {
                  console.warn("Pagamento aprovado mas sem dados de QR code:", data);
                }
              })
              .catch((error) => {
                console.error("Erro detalhado:", {
                  message: error.message,
                  details: error.details
                });
              });
            }
            else {
              console.error("cardForm não foi inicializado corretamente.");
            }
          }
          },
        });
      }
    };

    // Carrega o script do Mercado Pago apenas uma vez
    if (!window.MercadoPago) {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.onload = initializeMercadoPago;
      document.body.appendChild(script);

      // Remover o script quando o componente for desmontado
      return () => {
        document.body.removeChild(script);
      };
    } else {
      // Caso o script já tenha sido carregado
      initializeMercadoPago();
    }
  }, [total]);
  return (
    <div className=" bg-white p-6 rounded-lg shadow-lg" >
      {/* <form id="form-checkout" className="space-y-6 pb-36">
        <div >
          <input
            type="text"
            id="form-checkout__cardNumber"
            placeholder="Número do cartão"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div >
          <input
            type="text"
            id="form-checkout__expirationDate"
            placeholder="MM/YY"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="text"
            id="form-checkout__securityCode"
            placeholder="Código de segurança"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="text"
            id="form-checkout__cardholderName"
            placeholder="Titular do cartão"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <select
            id="form-checkout__issuer"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o banco emissor</option>
                    </select>
        </div>
  
        <div>
          <select
            id="form-checkout__installments"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o número de parcelas</option>
            
          </select>
        </div>
  
        <div>
          <select
            id="form-checkout__identificationType"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o tipo de documento</option>
            /}
          </select>
        </div>
  
        <div>
          <input
            type="text"
            id="form-checkout__identificationNumber"
            placeholder="Número do documento"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div>
          <input
            type="email"
            id="form-checkout__cardholderEmail"
            placeholder="E-mail"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
  
        <div className="flex justify-center">
          <button
            type="submit"
            id="form-checkout__submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Pagar
          </button>
        </div>
  
        <progress value="0" className="w-full mt-4" aria-label="Carregando..." />
      </form> */}
      
       <form id="form-checkout" className="mb-64">
    <div id="form-checkout__cardNumber" class="container"></div>
    <div id="form-checkout__expirationDate" class="container"></div>
    <div id="form-checkout__securityCode" class="container"></div>
    <input type="text" id="form-checkout__cardholderName" />
    <select id="form-checkout__issuer"></select>
    <select id="form-checkout__installments"></select>
    <select id="form-checkout__identificationType"></select>
    <input type="text" id="form-checkout__identificationNumber" />
    <input type="email" id="form-checkout__cardholderEmail" />

    <button type="submit" id="form-checkout__submit">Pagar</button>
    <progress value="0" class="progress-bar">Carregando...</progress>
  </form>
    </div>
  );
  
  
};

export default MercadoPagoComponent;