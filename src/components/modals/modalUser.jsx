"use client";
import { useState } from "react";

export default function UserInfoModal({ onSubmit }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    const userData = { name, phone,email };
    localStorage.setItem("userData", JSON.stringify(userData));
    onSubmit(); // Fechar o modal e prosseguir para o próximo passo
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-4">Por favor, informe seus dados</h2>
        <div className="mb-4">
  <label className="block text-sm">E-mail:</label>
  <input
    type="email"
    className="w-full p-2 border rounded"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Digite seu e-mail"
  />
</div>
        <div className="mb-4">
          <label className="block text-sm">Nome:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm">Telefone:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Digite seu telefone"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
