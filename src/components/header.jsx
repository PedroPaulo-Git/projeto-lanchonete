import React from "react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";

const header = () => {
  return (
    <div>
      <div className="w-full flex items-center px-6 gap-4 ">
        <IoIosSearch />
        <input
          className="w-full h-14  "
          placeholder="Buscar no cardápio"
          type="text"
        />
      </div>
      <div className="bg-amber-600 h-40 relative">
        <div className="bg-white rounded-full h-24 w-24 absolute -bottom-8 left-4 items-center justify-center text-center">
          <Image
            src="https://dummyimage.com/200x200/000/fff"
            width={200}
            height={200}
            className="p-1 rounded-full"
            alt="Imagem placeholder"
          />
        </div>
      </div>


      <div className="mt-8 px-4">
        <h1 className="font-bold text-3xl">burguer</h1>
        <span>
          <p className="text-gray-700">Rua X, 23</p>
          <li>Mais informações</li>
          <span className="flex justify-between">
            <p className="text-red-500 max-w-[60%]">
              Loja fechada no momento, abre hoje ás 00:00
            </p>
            <span className="bg-gray-200 text-center justify-center p-1 max-w-28">
                <p className="text-gray-400 text-sm">Entrega e Retirada</p>
            </span>
          </span>
          
            </span>
      </div>


    </div>
  );
};

export default header;
