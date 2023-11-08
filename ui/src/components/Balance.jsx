import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { cn } from "../utils/index";
import { useBalance } from "../context/BalanceContext";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

function BalanceItem({ name, value, imgUrl, onSelect, onHide }) {
  return (
    <div
      onClick={() => {
        onSelect({ name, imgUrl, value });
        onHide(false);
      }}
      className="flex items-center justify-between bg-[#4d316c] transition-all hover:scale-105 px-3 py-1 rounded-lg cursor-pointer"
    >
      <div className="flex items-center gap-2 text-sm md:text-base">
        <img src={imgUrl} alt="" className="h-7" />
        <strong className="text-gray-300 font-extralight">{name}</strong>
      </div>
      <strong className="text-white font-extralight text-sm md:text-base">
        {value?.toFixed(4)}
      </strong>
    </div>
  );
}

function Balance({ className }) {
  const { showBalance, setShowBalance, currentBalance, setCurrentBalance } =
    useBalance();
  const { user: account } = useCurrentUser();

  return (
    <div className="relative">
      <button
        onClick={() => setShowBalance((show) => !show)}
        className={cn(
          "flex items-center justify-between text-white gap-2 bg-[#2e2550] rounded-xl px-4 md:px-4 py-1 md:py-2 shadow-[0px_4px_4px_0px_#00000040]",
          className
        )}
      >
        <img
          src={currentBalance.imgUrl || "/tokens/btc.png"}
          alt=""
          className="h-6 md:h-7"
        />
        <span className="uppercase font-extralight text-sm md:text-base">
          {currentBalance.value?.toFixed(4) || account?.btc.toFixed(4)}
        </span>
        <MdOutlineKeyboardArrowDown />
      </button>

      {showBalance && (
        <div className="absolute w-[13rem] md:w-[18rem] top-12 left-0 bg-[#3c2f61] p-2 rounded-2xl space-y-2 z-[999] shadow-md">
          <BalanceItem
            name="BTC"
            value={account?.btc}
            imgUrl="/tokens/btc.png"
            onHide={setShowBalance}
            onSelect={setCurrentBalance}
          />

          <BalanceItem
            name="USDT"
            value={account?.usdt}
            imgUrl="/tokens/usdt.png"
            onHide={setShowBalance}
            onSelect={setCurrentBalance}
          />

          <BalanceItem
            name="PACO"
            value={account?.paco}
            imgUrl="/tokens/paco.png"
            onHide={setShowBalance}
            onSelect={setCurrentBalance}
          />

          <BalanceItem
            name="ETH"
            value={account?.eth}
            imgUrl="/tokens/eth.png"
            onHide={setShowBalance}
            onSelect={setCurrentBalance}
          />

          <BalanceItem
            name="BNB"
            value={account?.bnb}
            imgUrl="/tokens/bnb.png"
            onHide={setShowBalance}
            onSelect={setCurrentBalance}
          />
        </div>
      )}
    </div>
  );
}

export default Balance;
