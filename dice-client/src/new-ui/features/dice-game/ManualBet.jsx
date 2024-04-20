import { useEffect, useState } from "react";
import { useBalance } from "../../../context/BalanceContext";
import { getCoinPrice } from "../../../utils/tokenPrice";

function ManualBet({
  betAmount,
  setBetAmount,
  payout,
  setPayout,
  showError,
  setShowError,
  minBet = "0.00000001",
}) {
  const [maxBet, setMaxBet] = useState(0);
  const [selectedBtn, setSelectedBtn] = useState("");
  const { currentBalance } = useBalance();

  useEffect(() => {
    if (currentBalance) {
      const getCoinPriceData = async () => {
        const _price = await getCoinPrice(currentBalance?.name?.toLowerCase());
        const _maxBet = 100 / _price;

        setMaxBet(
          Number(currentBalance?.value) > _maxBet
            ? _maxBet
            : Number(currentBalance?.value)
        );
      };
      getCoinPriceData();
    }
  }, [currentBalance]);

  function handleBetAmountChange(e) {
    const { value } = e.target;
    const newValue = parseFloat(value);

    if (newValue < 0) return setShowError("Please enter a positive number.");

    setBetAmount(value);
    setShowError("");
  }

  return (
    <>
      <div className="px-4 py-4">
        <h2 className="text-base tablet:text-xl mb-2">Bet Amount</h2>
        <div className="flex items-center gap-1 bg-[#271836] p-2 tablet:p-3 border-2 border-[#473459]">
          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <img
                src={currentBalance.imgUrl}
                alt=""
                className="w-6 tablet:w-8"
              />
              <span className="text-lg tablet:text-xl text-[#aa8fc6]">
                {currentBalance.name}
              </span>
            </div>
            <div
              className={`flex items-center rounded-lg border-2 ${
                showError ? "border-[#be1e1e]" : "border-transparent"
              } w-full`}
            >
              <input
                type="number"
                className="w-full bg-transparent text-xl tablet:text-2xl text-[#aa8fc6] focus:outline-none px-2"
                value={betAmount}
                onChange={handleBetAmountChange}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <button
              className={`${
                selectedBtn === "1/2"
                  ? "bg-[#3b2451] border-[#573b73]"
                  : "bg-[#563b71] border-[#745395]"
              } bg-[#563b71] border-2 text-sm tablet:text-base px-6 tablet:px-7 py-1 tablet:py-2 rounded-2xl shadow-lg flex justify-center items-center uppercase`}
              onClick={() => {
                if (parseFloat(betAmount / 2) < minBet) {
                  setBetAmount(parseFloat(minBet).toFixed(8));
                } else {
                  setBetAmount(parseFloat(betAmount / 2).toFixed(8));
                }
                setSelectedBtn("1/2");
              }}
            >
              1/2
            </button>
            <button
              className={`${
                selectedBtn === "x2"
                  ? "bg-[#3b2451] border-[#573b73]"
                  : "bg-[#563b71] border-[#745395]"
              } bg-[#563b71] border-2 text-sm tablet:text-base border-[#745395] px-6 tablet:px-7 py-1 tablet:py-2 rounded-2xl shadow-lg flex justify-center items-center uppercase`}
              onClick={() => {
                if (parseFloat(betAmount * 2) > maxBet) {
                  setBetAmount(parseFloat(maxBet).toFixed(8));
                }
                setBetAmount(parseFloat(betAmount * 2).toFixed(8));
                setSelectedBtn("x2");
              }}
            >
              x2
            </button>
            <button
              className={`${
                selectedBtn === "Min"
                  ? "bg-[#3b2451] border-[#573b73]"
                  : "bg-[#563b71] border-[#745395]"
              } bg-[#563b71] border-2 text-sm tablet:text-base border-[#745395] px-6 tablet:px-7 py-1 tablet:py-2 rounded-2xl shadow-lg flex justify-center items-center uppercase`}
              onClick={() => {
                setBetAmount(parseFloat(minBet).toFixed(8));
                setSelectedBtn("Min");
              }}
            >
              Min
            </button>
            <button
              className={`${
                selectedBtn === "Max"
                  ? "bg-[#3b2451] border-[#573b73]"
                  : "bg-[#563b71] border-[#745395]"
              } bg-[#563b71] border-2 text-sm tablet:text-base border-[#745395] px-6 tablet:px-7 py-1 tablet:py-2 rounded-2xl shadow-lg flex justify-center items-center uppercase`}
              onClick={() => {
                setBetAmount(parseFloat(maxBet).toFixed(8));
                setSelectedBtn("Max");
              }}
            >
              Max
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-2">
        <label htmlFor="profit" className="text-base tablet:text-xl">
          Profit
        </label>
        <div className="flex items-center justify-between bg-[#43295c] border border-[#7f5ea0] rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <img
              src={currentBalance.imgUrl}
              alt=""
              className="w-7 h-7 object-contain"
            />
            <input
              type="number"
              id="profit"
              className="bg-transparent w-full focus:outline-none text-xl text-[#aa8fc6]"
              value={Number(payout) ? Number(payout - betAmount).toFixed(8) : 0}
              readOnly
            />
          </div>
          <img src="/images/dollar.png" alt="" className="w-4" />
        </div>
      </div>
      <div className="px-4 pt-1 pb-4 space-y-2">
        <label htmlFor="payout" className="text-base tablet:text-xl">
          Payout
        </label>
        <div className="flex items-center justify-between bg-[#43295c] border border-[#7f5ea0] rounded-xl px-4 py-2">
          <input
            type="number"
            id="payout"
            className="bg-transparent w-full focus:outline-none text-xl text-[#aa8fc6]"
            value={Number(payout) ? Number(payout).toFixed(8) : 0}
            onChange={(e) => setPayout(e.target.value)}
            readOnly
          />
          <img src="/images/close.png" alt="" className="w-4" />
        </div>
      </div>
    </>
  );
}

export default ManualBet;
