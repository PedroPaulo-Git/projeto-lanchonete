import React from 'react'

const addressNotSavePopUp = () => {
  return (
    <div>
        <div role="alert" className=" absolute w-[90%] ml-3 rounded-sm border-s-4 border-red-500 bg-red-50 p-4">
  <strong className="block font-medium text-red-800"> Endereço não cadastrado! </strong>

  <p className="mt-2 text-sm text-red-700">
  Adicione um endereço antes de continuar.
  </p>
</div>
    </div>
  )
}

export default addressNotSavePopUp