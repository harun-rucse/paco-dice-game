import { useState } from "react";
import { useBuyTicket } from "../useBuyTicket";
import { abbreviateNumber } from "../../../utils/format";

function InputBox({ price, label, type, total, icon }) {
  const [amount, setAmount] = useState("");
  const { isLoading, buyTicket } = useBuyTicket();

  function handleBuyTicket() {
    if (!amount || !type) return;

    buyTicket({ type, amount });
    setAmount("");
  }

  return (
    <div className="flex justify-between items-center gap-2 md:gap-8">
      <div className="space-y-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div className="text-[#b4b3b3]">
            <div className="flex items-center gap-2 text-sm md:text-base uppercase">
              <p>Ticket price:</p>
              <span>{price}</span> PACO
              <img src="/tokens/paco.png" alt="" className="w-6" />
            </div>
            <span className="uppercase text-lg md:text-xl">{label}</span>
          </div>
          {total && (
            <p className="text-white">
              Total:{" "}
              <span>{amount ? abbreviateNumber(amount * price) : 0}</span> PACO
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 bg-[#1e132d] border border-[#743da1] rounded-xl px-3 py-0">
          <img src={icon} alt="" className="w-12" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Input amount of tickets"
            className="md:w-[20rem] bg-transparent text-white focus:outline-none placeholder:text-[#534b5c]"
          />
        </div>
      </div>
      <button
        className="self-end button !bg-[#d11f1f] px-2 md:!px-8"
        onClick={handleBuyTicket}
        disabled={isLoading}
      >
        {isLoading ? "Buying..." : "Buy"}
      </button>
    </div>
  );
}

export default InputBox;
