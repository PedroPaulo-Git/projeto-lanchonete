"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SuccessGIF from "../../assets/successGIF.gif";
import SuccessStatic from "../../assets/StaticSuccess.png"; // A imagem estática (primeira frame do GIF)

const SuccessPage = () => {
  const [isGifFinished, setIsGifFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGifFinished(true); // Define como verdadeiro após o tempo que o GIF demora para rodar
    }, 150); // Ajuste o tempo conforme a duração do seu GIF
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Recupera os dados do carrinho e do usuário
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartTotal = localStorage.getItem("cartTotal") || 0;
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Salva os dados do pedido em completedOrder
    localStorage.setItem("completedOrder", JSON.stringify({ cartItems, cartTotal, userData }));

    // Limpa os dados do carrinho
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartTotal");
  }, []); // O efeito será executado apenas na primeira renderização

  return (
    <div className="flex flex-col h-screen -mt-10 items-center text-center p-6 bg-white">
      {/* Se o GIF terminar, exibe a imagem estática */}
      {!isGifFinished ? (
        <Image
          src={SuccessGIF}
          alt="Pagamento Aprovado"
          className="success-gif"
        />
      ) : (
        <Image
          src={SuccessStatic}
          alt="Pagamento Aprovado"
          className="success-gif"
        />
      )}
      <div className="-mt-10 mx-auto items-center space-y-3">
        <h1 className="font-semibold">Pagamento Aprovado!</h1>
        <p>
          Obrigado pelo pedido! Seu pagamento foi aprovado. Acompanhe seu pedido
          clicando no botão abaixo.
        </p>

        <Link
          href="/acompanhar-pedido"
          className={`flex w-[75%] justify-center mt-10 mx-auto rounded-lg py-3 bg-black text-white font-medium`}
        >
          <div className="text-center items-center">Acompanhar meu pedido </div>
        </Link>
        <Link
          onClick={() => {
            // Limpar os dados do carrinho (cartItems e cartTotal)
            localStorage.removeItem("cartItems");
            localStorage.removeItem("cartTotal");
          }}
          className="font-medium"
          href="/"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
