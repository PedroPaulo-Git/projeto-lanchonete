"use client";
import { useState } from "react";

export default function UserInfoModal({ onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const userData = { name, phone, email };
    localStorage.setItem("userData", JSON.stringify(userData));
    onSubmit(); // Fechar o modal e prosseguir para o próximo passo
  };

  // Verifica se todos os campos estão preenchidos
  const isFormValid = name !== "" && phone !== "" && email !== "";

  return (
    <div className="fixed inset-0 flex justify-center bg-white items-center h-screen bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-4 font-semibold">Por favor, informe seus dados</h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">E-mail:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-400 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Nome:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">Telefone:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Digite seu telefone"
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`flex justify-center my-4 mx-auto rounded-lg w-full py-3 font-medium text-white sm:w-auto ${
            isFormValid ? "bg-black" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid} // Desabilita o botão se o formulário não for válido
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
