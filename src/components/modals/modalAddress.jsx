import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useCart } from "../../app/context/contextComponent";

const ModalAddress = ({ setmodalAddressOpen }) => {
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const { setSavedAddress, savedAddress } = useCart();

  // Função para salvar o endereço no localStorage
  const saveAddressToLocalStorage = () => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    userData.address = { address, neighborhood, street, number, complement };
    localStorage.setItem("userData", JSON.stringify(userData));
    setSavedAddress(userData.address); // Atualiza o contexto global
  };

  // UseEffect para salvar automaticamente no localStorage sempre que algum campo for alterado
  useEffect(() => {
    // Verifica se todos os campos foram preenchidos antes de salvar
    if (address && neighborhood && street && number) {
      saveAddressToLocalStorage();
    }
  }, [address, neighborhood, street, number, complement]); // Monitora as mudanças dos campos

  useEffect(() => {
    if (savedAddress) {
      // Aqui você pode atualizar o checkout com o endereço salvo
      console.log("Endereço salvo:", savedAddress);
    }
  }, [savedAddress]);

  const handleCloseModal = () => {
    setmodalAddressOpen(false);
  };

  return (
    <div className="h-screen z-30">
      <section>
        <div className="flex justify-between p-5 items-center bg-white">
          <IoIosArrowBack className="text-xl" onClick={handleCloseModal} />
          <p>Endereço de entrega</p>
          <IoMdClose className="text-xl" onClick={handleCloseModal} />
        </div>
        <div className="mx-auto max-w-screen-xl">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="rounded-lg p-4 lg:col-span-3 lg:p-12">
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                    placeholder="Endereço"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                    placeholder="Bairro"
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-10 gap-4">
                  <input
                    className="col-span-7 w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                    placeholder="Rua"
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <input
                    className="col-span-3 w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                    placeholder="N°"
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <input
                  className="w-full rounded-lg bg-white shadow-inner border border-gray-200 p-3 text-sm"
                  placeholder="Complemento (opcional)"
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                />
                <button
                  type="button"
                  className="inline-block w-full mt-28 bottom-10 rounded-sm bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  onClick={handleCloseModal}
                >
                  Cadastrar endereço
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModalAddress;
