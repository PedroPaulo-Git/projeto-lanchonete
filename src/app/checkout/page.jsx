"use client"; // Garante que o componente é renderizado no lado do cliente

import { useState,useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MercadoPagoComponent from "@/components/mercadopagocomponent";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const total = parseFloat(searchParams.get("total")); // Recebe o valor total da URL
  const [cartValueTotal,setcartValueTotal] = useState(0)
  const [step, setStep] = useState(1); // Controla a etapa atual do checkout
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
      setcartValueTotal(total)
    }
  }, []);
  
  // Etapa 1: Local de entrega
  const renderDeliveryStep = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Local de entrega{cartValueTotal}</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Digite seu endereço"
          />
        </div>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Próximo
        </button>
      </form>
    </div>
  );

  // Etapa 2: Pagamento
  const renderPaymentStep = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
      <MercadoPagoComponent total={total} />
      <button
        type="button"
        onClick={() => setStep(3)}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Concluir Pedido
      </button>
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
      {step === 1 && renderDeliveryStep()}
      {step === 2 && renderPaymentStep()}
      {step === 3 && renderConfirmationStep()}
    </div>
  );
}