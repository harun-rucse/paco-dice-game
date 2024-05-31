import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useBalance } from "../../context/BalanceContext";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import ToggleUSD from "./ToggleUSD";
import useGetCoinPrice from "../../hooks/useGetCoinPrice";
import LoadingSpinner from "./LoadingSpinner";
import { cn } from "../../utils/index";
import { multiply } from "../../utils/decimal";
import { currencyFormat } from "../../utils/format";

function BalanceItem({
  name,
  value,
  imgUrl,
  onSelect,
  onHide,
  isDollar,
  price,
}) {
  return (
    <div
      onClick={() => {
        onSelect({ name, imgUrl, value });
        onHide(false);
      }}
      className="flex min-w-[16rem] tablet:w-full items-center gap-2 justify-between bg-[#55527d] dark:bg-[#523376] transition-all hover:scale-105 px-3 py-1 rounded-lg cursor-pointer"
    >
      <div className="flex items-center gap-2 text-sm tablet:text-base">
        <img src={imgUrl} alt="" className="h-7" />
        <strong className="text-gray-300 hidden tablet:block font-extralight">
          {name == "BNB" ? "WBNB" : name === "BTC" ? "WBTC" : name}
        </strong>
      </div>
      <strong className="text-white font-extralight text-sm tablet:text-base">
        {isDollar
          ? currencyFormat(multiply(value, price?.[name.toLowerCase()]))
          : Number(value)?.toFixed(8)}
        {/* {isDollar ? Number(value)?.toFixed(8) : value} */}
      </strong>
    </div>
  );
}

function Balance({ className }) {
  const [isDollar, setShowDollar] = useState(false);
  const { showBalance, setShowBalance, currentBalance, setCurrentBalance } =
    useBalance();
  const { user: account } = useCurrentUser();
  const { isLoading, price } = useGetCoinPrice();

  return (
    <div className="relative">
      <button
        onClick={() => setShowBalance((show) => !show)}
        className={cn(
          "flex items-center justify-between w-max tablet:min-w-[180px] text-white gap-2 bg-[#413e72] dark:bg-[#3a2354] border border-[#605e96] dark:border-transparent rounded-xl px-4 tablet:px-4 py-1 tablet:py-2 shadow-[0px_4px_4px_0px_#00000040]",
          className
        )}
      >
        <img
          src={currentBalance.imgUrl || "/tokens/btc.png"}
          alt=""
          className="h-6 tablet:h-7"
        />
        <span className="uppercase font-extralight text-sm tablet:text-base">
          {currentBalance?.name === "PACO"
            ? Number(currentBalance.value)?.toFixed(2)
            : Number(currentBalance.value)?.toFixed(8) ||
              Number(account?.btc).toFixed(8)}
        </span>
        {/* <span className="block uppercase font-extralight text-sm tablet:text-base">
          {currentBalance?.value && currentBalance.value.toString()?.length > 6
            ? currentBalance.value.substring(0, 6)
            : Number(currentBalance.value)?.toFixed(4)}
        </span> */}
        <MdOutlineKeyboardArrowDown size={28} color="#ffff" />
      </button>

      {showBalance && (
        <div className="absolute min-w-[13rem] tablet:w-[20rem] top-12 tablet:top-14 left-0 bg-[#413e72] dark:bg-[#3a2354] p-2 rounded-2xl space-y-2 z-[999] shadow-md">
          {isLoading ? (
            <LoadingSpinner className="w-[20rem]" />
          ) : (
            <>
              <BalanceItem
                name="BTC"
                value={account?.btc}
                imgUrl="/tokens/btc.png"
                onHide={setShowBalance}
                onSelect={setCurrentBalance}
                isDollar={isDollar}
                price={price}
              />

              <BalanceItem
                name="USDT"
                value={account?.usdt}
                imgUrl="/tokens/usdt.png"
                onHide={setShowBalance}
                onSelect={setCurrentBalance}
                isDollar={isDollar}
                price={price}
              />

              <BalanceItem
                name="PACO"
                value={account?.paco}
                imgUrl="/tokens/paco.png"
                onHide={setShowBalance}
                onSelect={setCurrentBalance}
                isDollar={isDollar}
                price={price}
              />

              <BalanceItem
                name="ETH"
                value={account?.eth}
                imgUrl="/tokens/eth.png"
                onHide={setShowBalance}
                onSelect={setCurrentBalance}
                isDollar={isDollar}
                price={price}
              />

              <BalanceItem
                name="BNB"
                value={account?.bnb}
                imgUrl="/tokens/bnb.png"
                onHide={setShowBalance}
                onSelect={setCurrentBalance}
                isDollar={isDollar}
                price={price}
              />
            </>
          )}

          <div className="flex items-center justify-between px-2 py-1">
            <span className="tablet:text-xl text-[#7d78c6] dark:text-[#774ca7]">
              Show in FIAT
            </span>
            <ToggleUSD
              onSwitch={(state) => setShowDollar(state)}
              defaultValue={isDollar}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Balance;
