import { useEffect, useState } from "react";
import { useBalance } from "../../../context/BalanceContext";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";

function Button({ selectedBtn, children, handleClick }) {
  return (
    <button
      className={`${
        selectedBtn === children
          ? "bg-[#221f48] dark:bg-[#281838] border-[#302e5a] dark:border-[#39274b]"
          : "bg-[#2f2b65] dark:bg-[#3b2451] border-[#454183] dark:border-[#573b73]"
      } border-2 text-sm tablet:text-base px-6 tablet:px-7 py-1 tablet:py-2 rounded-2xl shadow-lg flex justify-center items-center uppercase`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

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
  const { price, isLoading } = useGetCoinPrice();

  useEffect(() => {
    if (currentBalance && price) {
      const getCoinPriceData = async () => {
        const _price = await price[currentBalance?.name?.toLowerCase()];
        const _maxBet = 99.99 / _price;
        console.log(_price, _maxBet);

        setMaxBet(
          Number(currentBalance?.value) > _maxBet
            ? _maxBet
            : Number(currentBalance?.value)
        );
      };
      getCoinPriceData();
    }
  }, [currentBalance, isLoading]);

  function handleBetAmountChange(e) {
    const { value } = e.target;
    const newValue = parseFloat(value);

    if (newValue < 0) return setShowError("Please enter a positive number.");

    setBetAmount(value);
    setShowError("");
  }

  return (
    <>
      <div className="px-2 laptop:px-4 py-4">
        <h2 className="text-base laptop:text-xl mb-2">Bet Amount</h2>
        <div className="flex items-center gap-1 bg-[#1d1b3b] dark:bg-[#271836] p-2 tablet:p-3 border-2 border-[#464192] dark:border-[#473459] rounded-xl">
          <div className="space-y-1">
            <div className="flex gap-2 items-center">
              <img
                src={currentBalance.imgUrl}
                alt=""
                className="w-6 tablet:w-8"
              />
              <span className="text-lg laptop:text-xl text-[#7571b5] dark:text-[#aa8fc6]">
                {currentBalance?.name == "BNB"
                  ? "WBNB"
                  : currentBalance?.name === "BTC"
                  ? "WBTC"
                  : currentBalance?.name}
              </span>
            </div>
            <div
              className={`flex items-center rounded-lg border-2 ${
                showError ? "border-[#be1e1e]" : "border-transparent"
              } w-full`}
            >
              <input
                type="number"
                className="w-full bg-transparent text-xl tablet:text-2xl text-[#7571b5] dark:text-[#aa8fc6] focus:outline-none px-2"
                value={betAmount}
                onChange={handleBetAmountChange}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid tablet:hidden desktop:grid grid-cols-2 gap-x-4 gap-y-2">
            <Button
              selectedBtn={selectedBtn}
              handleClick={() => {
                if (parseFloat(betAmount / 2) < minBet) {
                  setBetAmount(parseFloat(minBet).toFixed(8));
                } else {
                  setBetAmount(parseFloat(betAmount / 2).toFixed(8));
                }
                setSelectedBtn("1/2");
              }}
            >
              1/2
            </Button>

            <Button
              selectedBtn={selectedBtn}
              handleClick={() => {
                if (parseFloat(betAmount * 2) > maxBet) {
                  setBetAmount(parseFloat(maxBet).toFixed(8));
                }
                setBetAmount(parseFloat(betAmount * 2).toFixed(8));
                setSelectedBtn("x2");
              }}
            >
              x2
            </Button>

            <Button
              selectedBtn={selectedBtn}
              handleClick={() => {
                setBetAmount(parseFloat(minBet).toFixed(8));
                setSelectedBtn("Min");
              }}
            >
              Min
            </Button>

            <Button
              selectedBtn={selectedBtn}
              handleClick={() => {
                setBetAmount(parseFloat(maxBet).toFixed(8));
                setSelectedBtn("Max");
              }}
            >
              Max
            </Button>
          </div>
        </div>
        <div className="hidden tablet:grid desktop:hidden grid-cols-2 laptop:grid-cols-4 gap-x-4 laptop:gap-x-2 gap-y-2 mt-4">
          <Button
            selectedBtn={selectedBtn}
            handleClick={() => {
              if (parseFloat(betAmount / 2) < minBet) {
                setBetAmount(parseFloat(minBet).toFixed(8));
              } else {
                setBetAmount(parseFloat(betAmount / 2).toFixed(8));
              }
              setSelectedBtn("1/2");
            }}
          >
            1/2
          </Button>

          <Button
            selectedBtn={selectedBtn}
            handleClick={() => {
              if (parseFloat(betAmount * 2) > maxBet) {
                setBetAmount(parseFloat(maxBet).toFixed(8));
              }
              setBetAmount(parseFloat(betAmount * 2).toFixed(8));
              setSelectedBtn("x2");
            }}
          >
            x2
          </Button>

          <Button
            selectedBtn={selectedBtn}
            handleClick={() => {
              setBetAmount(parseFloat(minBet).toFixed(8));
              setSelectedBtn("Min");
            }}
          >
            Min
          </Button>

          <Button
            selectedBtn={selectedBtn}
            handleClick={() => {
              setBetAmount(parseFloat(maxBet).toFixed(8));
              setSelectedBtn("Max");
            }}
          >
            Max
          </Button>
        </div>
      </div>
      <div className="px-4 py-4 space-y-2">
        <label htmlFor="profit" className="text-base laptop:text-xl">
          Profit
        </label>
        <div className="flex items-center justify-between bg-[#2f2c58] dark:bg-[#43295c] border border-[#4f49a5] dark:border-[#7f5ea0] rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <img
              src={currentBalance.imgUrl}
              alt=""
              className="w-7 h-7 object-contain"
            />
            <input
              type="number"
              id="profit"
              className="bg-transparent w-full focus:outline-none text-xl text-[#7571b5] dark:text-[#aa8fc6] py-1"
              value={Number(payout) ? Number(payout - betAmount).toFixed(8) : 0}
              readOnly
            />
          </div>
          <span className="text-xl font-bold text-[#7571b5] dark:text-[#aa8fc6]">
            $
          </span>
        </div>
      </div>
      <div className="px-4 pt-1 pb-4 space-y-2">
        <label htmlFor="payout" className="text-base laptop:text-xl">
          Payout
        </label>
        <div className="flex items-center justify-between bg-[#2f2c58] dark:bg-[#43295c] border border-[#4f49a5] dark:border-[#7f5ea0] rounded-xl px-4 py-2">
          <input
            type="number"
            id="payout"
            className="bg-transparent w-full focus:outline-none text-xl text-[#7571b5] dark:text-[#aa8fc6] py-1"
            value={Number(payout) ? Number(payout).toFixed(8) : 0}
            onChange={(e) => setPayout(e.target.value)}
            readOnly
          />
          <span className="text-xl font-bold text-[#7571b5] dark:text-[#aa8fc6]">
            X
          </span>
        </div>
      </div>
    </>
  );
}

export default ManualBet;
