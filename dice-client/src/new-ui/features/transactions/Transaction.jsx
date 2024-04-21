import { useState } from "react";
import Deposite from "./Deposite";
import Withdraw from "./Withdraw";

function Transaction() {
  const [current, setCurrent] = useState("deposite");

  return (
    <div className="flex flex-col md:flex-row items-start h-[80vh] md:h-full mb-10 md:mb-0">
      <div className="w-full md:w-[24rem] md:h-[36rem] bg-[#24224a] space-y-3 px-6 py-8">
        <div
          onClick={() => setCurrent("deposite")}
          className="bg-[#413e72] border border-[#605e96] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-extralight text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          DEPOSIT
        </div>
        <div
          onClick={() => setCurrent("withdraw")}
          className="bg-[#1c1a3e] border border-[#2a285d] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-extralight text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          Withdraw
        </div>
      </div>

      <div className="w-full bg-[#1c1a3e] px-6 py-8 space-y-3">
        {current === "deposite" ? <Deposite /> : <Withdraw />}
      </div>
    </div>
  );
}

export default Transaction;
