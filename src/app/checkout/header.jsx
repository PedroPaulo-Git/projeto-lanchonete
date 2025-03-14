import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";

const HeaderCheckout = ({ progress, handlePreviousStep }) => {
  const router = useRouter();

  const handleGoHome = () => {
    document.body.style.overflow = "auto";
    router.push("/");
  };

  const handleBackStep = () => {
    if (progress < 100) {
      handlePreviousStep();
    }
    if (progress < 20) {
      handleGoHome();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <IoIosArrowBack onClick={handleBackStep} />
        <p>Checkout</p>
        <IoClose onClick={handleGoHome} />
      </div>
      <div>
        <h2 className="sr-only">Steps</h2>
        <div className="bg-white p-4">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gray-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-500">
            <li
              className={`items-center justify-items-start ${
                progress >= 33 ? "text-black" : "text-gray-400"
              } sm:gap-1.5`}
            >
              <span className="hidden sm:inline">Details</span>
              <p
                className={`items-center flex flex-col justify-center ${
                  progress ? "text-black" : "text-gray-400"
                } sm:gap-1.5`}
              >
                <MdDeliveryDining className="text-xl" />
                Entrega
              </p>
            </li>
            <li
              className={`flex flex-col items-center justify-center ${
                progress >= 66 ? "text-black" : "text-gray-400"
              } sm:gap-1.5`}
            >
              <span className="hidden sm:inline">Address</span>
              <p
                className={`items-center flex flex-col justify-center ${
                  progress >= 50 ? "text-black" : "text-gray-400"
                } sm:gap-1.5`}
              >
                <MdOutlinePayments className="text-xl" /> Pagamento
              </p>
            </li>
            <li
              className={`items-right justify-items-end ${
                progress === 100 ? "text-black" : "text-gray-400"
              } sm:gap-1.5`}
            >
              <span className="hidden sm:inline">Payment</span>
              <p
                className={`items-center  flex flex-col justify-center ${
                  progress === 100 ? "text-black" : "text-gray-400"
                } sm:gap-1.5`}
              >
                <AiOutlineFileDone className="text-xl" /> Concluído
              </p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default HeaderCheckout;
