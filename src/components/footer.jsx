import React from 'react'
import { GoHome } from "react-icons/go";
import { LuClipboardPenLine } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
const footer = () => {
  return (
    <div className='z-10 text-gray-500 bg-white flex w-screen justify-between px-6 fixed bottom-0 shadow-2xl border-t-[0.5px] border-gray-200 h-20   text-center items-center'>
        <span className='text-center items-center justify-center flex flex-col'>
            <GoHome className='text-2xl mb-1'/>
            Home
        </span>
        <span  className='text-center items-center justify-center flex flex-col'>
            <LuClipboardPenLine className='text-2xl mb-1'/>
           Pedidos
        </span>
        <span  className='text-center items-center justify-center flex flex-col'>
            <FaUser className='text-2xl mb-1'/>
         Perfil
        </span>
    </div>
  )
}

export default footer