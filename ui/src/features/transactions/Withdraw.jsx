import { useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import Balance from "../../components/Balance";
import { useBalance } from "../../context/BalanceContext";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const { currentBalance } = useBalance();

  function handleAll() {
    setAmount(currentBalance.value);
  }

  return (
    <>
      <h2 className="text-lg uppercase font-extrabold text-white">Withdraw</h2>
      <Balance className="gap-4" />

      <div className="flex flex-col gap-3 pt-6 text-white">
        <input
          type="text"
          placeholder="Enter Address"
          className="bg-[#1f1d22] focus:outline-none placeholder:uppercase font-bold px-4 py-3 rounded-lg border border-gray-600"
        />

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              placeholder="Enter Amount"
              className="bg-[#1f1d22] focus:outline-none placeholder:uppercase font-bold px-4 py-3 rounded-lg border border-gray-600"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span
              onClick={handleAll}
              className="absolute right-1 top-2 cursor-pointer uppercase text-white text-sm bg-[#2e2550] rounded-xl p-2"
            >
              All
            </span>
          </div>

          <div className="relative w-full flex items-center gap-2 bg-[#1f1d22] px-4 py-2 rounded-lg border border-gray-600">
            <img src={currentBalance.imgUrl} alt="" className="h-7" />
            <div className="flex flex-col ">
              <span className="uppercase text-gray-400 font-bold text-xs">
                Balance
              </span>
              <strong className="text-white text-sm font-bold">
                {currentBalance.value}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#323232] px-4 py-2 rounded-xl text-white mt-6">
          <AiFillWarning color="#ffcc00" size={20} />
          <span className="text-sm uppercase font-bold">
            MINIMUM WITHDRAWAL AMOUNT IS 500000 PACO.
          </span>
        </div>

        <div className="mt-[8rem] w-full">
          <button className="bg-[#d11f1f] w-full uppercase text-sm font-extrabold px-6 py-2 rounded-lg shadow-[ 0px_4px_4px_0px_#00000040]">
            Withdraw
          </button>
          <p className="text-xs font-bold mt-2">
            TRANSACTION FEE - 10000 PACO.
          </p>
        </div>
      </div>
    </>
  );
}

export default Withdraw;
