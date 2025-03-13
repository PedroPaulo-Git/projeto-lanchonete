import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
const modalAddress = ({ setmodalAddressOpen }) => {
  return (
    <div className="h-screen">
      <section>
        <div className="flex justify-between p-4 items-center bg-white">
          <IoIosArrowBack
            className="text-xl"
            onClick={() => setmodalAddressOpen(false)}
          />
          <p>Endereço de entrega</p>
          <IoMdClose
            className="text-xl"
            onClick={() => setmodalAddressOpen(false)}
          />
        </div>
        <div className="mx-auto max-w-screen-xl ">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="rounded-lg p-4 lg:col-span-3 lg:p-12">
              <form action="#" className="space-y-4">
                {/* Endereço e Bairro */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="sr-only" htmlFor="address">
                      Endereço
                    </label>
                    <input
                      className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                      placeholder="Endereço"
                      type="text"
                      id="address"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="neighborhood">
                      Bairro
                    </label>
                    <input
                      className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                      placeholder="Bairro"
                      type="text"
                      id="neighborhood"
                    />
                  </div>
                </div>

                {/* Rua e Número na mesma linha */}
                <div className="grid grid-cols-10 gap-4">
                  <div className="col-span-7">
                    <label className="sr-only" htmlFor="street">
                      Rua
                    </label>
                    <input
                      className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                      placeholder="Rua"
                      type="text"
                      id="street"
                    />
                  </div>

                  <div className="col-span-3 ">
                    <label className="sr-only" htmlFor="number">
                      Número
                    </label>
                    <input
                      className="w-full rounded-lg shadow-inner border bg-white border-gray-200 p-3 text-sm"
                      placeholder="N°"
                      type="text"
                      id="number"
                    />
                  </div>
                </div>

                {/* Complemento */}
                <div>
                  <label className="sr-only" htmlFor="complement">
                    Complemento
                  </label>
                  <input
                    className="w-full rounded-lg bg-white shadow-inner border border-gray-200 p-3 text-sm"
                    placeholder="Complemento (opcional)"
                    type="text"
                    id="complement"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-block w-[92%] absolute bottom-10 rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                   Cadastrar endereço
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <input placeholder="" type="text" />
    </div>
  );
};

export default modalAddress;
