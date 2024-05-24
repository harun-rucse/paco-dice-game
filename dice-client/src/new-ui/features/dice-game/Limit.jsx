import useGetCoinPrice from "../../../hooks/useGetCoinPrice";
import LoadingSpinner from "../../components/LoadingSpinner";

function TextBox({ img, value, isInteger = false, paco = false }) {
  return (
    <div className="flex items-center justify-between">
      <img src={img} alt="" className="w-8 tablet:w-10 tablet:ml-2" />
      <span className="text-lg tablet:text-2xl">
        {paco
          ? `${value}B`
          : isInteger
          ? Number(100 / value).toFixed(0)
          : Number(100 / value).toFixed(8)}
      </span>
    </div>
  );
}

function Limit() {
  const { price = { btc: 0, paco: 0, eth: 0, bnb: 0, usdt: 0 }, isLoading } =
    useGetCoinPrice();

  return (
    <div className="w-full p-2 tablet:p-6 bg-gradient-to-b from-[#39366f] dark:from-[#42375f] via-[#24224a] dark:via-[#1e182d] to-[#24224a] dark:to-[#1d172c] h-full md:min-h-[36rem] rounded-2xl">
      <h2 className="text-2xl tablet:text-4xl text-center mb-3">Limits</h2>
      <div className="p-1 tablet:p-6">
        <div className="flex justify-between text-lg tablet:text-2xl">
          <p>Max Bet</p>
          <p>Max Payout</p>
        </div>
        {isLoading ? (
          <LoadingSpinner className="h-[25rem]" />
        ) : (
          <div className="mt-2 flex bg-[#282749] border border-[#4c4a7c] rounded-xl shadow-lg">
            <div className="flex-1 border-r-[3px] border-[#595590] p-3 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/dollar.png" alt="" className="w-3" />
                  <span className="tablet:text-2xl">USD</span>
                </div>
                <span className="tablet:text-2xl">$100</span>
              </div>

              <div className="space-y-6 pt-2">
                <TextBox img="/tokens/btc.png" value={price?.btc} />
                <TextBox img="/tokens/usdt.png" value={price?.usdt} isInteger />
                <TextBox
                  img="/tokens/paco.png"
                  value={Number(100 / price?.paco / 10 ** 9).toFixed(5)}
                  paco
                />
                <TextBox img="/tokens/eth.png" value={price?.eth} />
                <TextBox img="/tokens/bnb.png" value={price?.bnb} />
              </div>
            </div>
            <div className="flex-1 p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="/dollar.png" alt="" className="w-3" />
                  <span className="tablet:text-2xl">USD</span>
                </div>
                <span className="tablet:text-2xl">$10,000</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Limit;
