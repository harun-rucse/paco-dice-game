import { useState } from "react";
import Deposite from "./Deposite";
import Withdraw from "./Withdraw";

function Transaction() {
  const [current, setCurrent] = useState("deposite");

  return (
    <div className="flex flex-col md:flex-row items-start h-[80vh] md:h-full mb-10 md:mb-0">
      <div className="w-full md:w-[24rem] md:h-[36rem] bg-[#411b6a] space-y-3 px-6 py-8">
        <div
          onClick={() => setCurrent("deposite")}
          className="bg-[#1f5cb8] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-bold text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          Deposite
        </div>
        <div
          onClick={() => setCurrent("withdraw")}
          className="bg-[#6c1fb8] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-bold text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          Withdraw
        </div>
      </div>

      <div className="w-full bg-[#2b1346] px-6 py-8 space-y-3">
        {current === "deposite" ? <Deposite /> : <Withdraw />}
      </div>
    </div>
  );
}

export default Transaction;
