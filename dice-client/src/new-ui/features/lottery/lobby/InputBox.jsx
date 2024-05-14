import { useState } from "react";
import { useBuyTicket } from "../useBuyTicket";
import { abbreviateNumber } from "../../../../utils/format";
import Modal from "../../../components/Modal";
import Authentication from "../../authentication/Authentication";
import { useCurrentUser } from "../../authentication/useCurrentUser";

function InputBox({ price, label, type, total, icon }) {
  const [amount, setAmount] = useState("");
  const { isLoading, buyTicket } = useBuyTicket();
  const { isAuthenticated, isLoading: isAuthLoading } = useCurrentUser();

  function handleBuyTicket() {
    if (!amount || !type) return;

    buyTicket({ type, amount });
    setAmount("");
  }

  return (
    <div className="flex flex-row tablet:flex-col laptop:flex-row justify-between items-center gap-2 laptop:gap-8">
      <div className="space-y-1">
        <div className="flex flex-col tablet:flex-row tablet:items-end justify-between">
          <div className="text-[#b4b3b3]">
            <div className="flex items-center gap-2 text-sm tablet:text-base uppercase">
              <p>Ticket price:</p>
              <span>{price}</span> PACO
              <img src="/tokens/paco.png" alt="" className="w-6" />
            </div>
            <span className="uppercase text-sm laptop:text-xl">{label}</span>
          </div>
          {total && (
            <p className="text-white text-sm laptop:text-xl">
              Total:{" "}
              <span>{amount ? abbreviateNumber(amount * price) : 0}</span> PACO
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 laptop:gap-3 bg-[#333061] dark:bg-[#1e132d] border-2 border-[#3e3b73] dark:border-[#743da1] rounded-xl px-3 py-0">
          <img src={icon} alt="" className="w-9 tablet:w-12" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Input amount of tickets"
            className="w-[10rem] tablet:w-[12rem] laptop:w-[20rem] bg-transparent text-sm laptop:text-base text-white focus:outline-none placeholder:text-[#605e7e] placeholder:dark:text-[#534b5c]"
            disabled={!isAuthLoading && !isAuthenticated}
          />
        </div>
      </div>

      {!isAuthLoading && isAuthenticated && (
        <button
          className="self-end tablet:self-center laptop:self-end button !bg-[#d11f1f] px-2 tablet:!px-8"
          onClick={handleBuyTicket}
          disabled={isLoading}
        >
          {isLoading ? "Buying..." : "Buy"}
        </button>
      )}

      {!isAuthLoading && !isAuthenticated && (
        <Modal>
          <Modal.Open opens="authentication">
            <button className="self-end text-sm tablet:text-base button !bg-[#d11f1f] px-2 tablet:!px-8">
              Login
            </button>
          </Modal.Open>
          <Modal.Body name="authentication">
            <Authentication />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default InputBox;
