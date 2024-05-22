import { AiFillWarning } from "react-icons/ai";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import Balance from "../../components/Balance";
import { useCurrentUser } from "../authentication/useCurrentUser";
import Spinner from "../../../components/Spinner";
import { useBalance } from "../../../context/BalanceContext";
import { IoClipboard } from "react-icons/io5";

function Deposite() {
  const { user: account, isLoading } = useCurrentUser();
  const { currentBalance } = useBalance();

  function handleCopy() {
    navigator.clipboard.writeText(account?.publicKey);
    toast.success("Deposit address is copied");
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <h2 className="text-lg uppercase font-extralight text-white">DEPOSIT</h2>
      <Balance className="gap-4" />

      <div className="flex flex-col gap-3 pt-6 text-white">
        <strong className="text-lg">
          YOUR {currentBalance?.name === "BTC" ? "WBTC" : currentBalance?.name}{" "}
          DEPOSIT ADDRESS
        </strong>
        <strong className="text-sm text-gray-300">
          IMPORTANT: THIS ADDRESS ACCEPTS ONLY BEP-20 TOKENS ON BNB SMART CHAIN
          MAINNET. SENDING OTHER COINS WILL RESULT IN A LOSS OF FUNDS. PLEASE
          COPY THE ADDRESS:
        </strong>

        <div className="mt-3 flex items-center justify-between gap-2 bg-[#1d1b3d] dark:bg-[#1e132d] border border-[#333062] dark:border-[#4c498b] px-3 md:px-4 py-1 rounded-xl">
          <input
            type="text"
            className="w-full bg-transparent dark:bg-[#1f1d22] focus:outline-none text-sm md:text-base"
            value={account?.publicKey}
            readOnly
          />
          <div
            className="bg-[#2e2c54] w-8 md:w-8 h-8 md:h-8 flex items-center justify-center rounded-lg cursor-pointer"
            onClick={handleCopy}
          >
            <IoClipboard color="#ffff" className="md:text-xl" />
          </div>
        </div>

        {/* <input
          type="text"
          value={account?.publicKey}
          className="bg-transparent dark:bg-[#1f1d22] pt-4 focus:outline-none font-extralight cursor-pointer p-2 rounded-lg border border-gray-600"
          onClick={handleCopy}
          readOnly
        /> */}
        <div className="flex flex-col tablet:flex-row items-center gap-3 pt-6 pb-6">
          <div className="space-y-4 tablet:w-[70%]">
            <div className="flex items-center gap-2 bg-[#413e72] dark:bg-[#323232] px-4 py-2 rounded-xl text-white">
              <AiFillWarning color="#ffcc00" size={20} />
              <span className="text-sm uppercase font-extralight">
                MINIMUM DEPOSIT IS{" "}
                {currentBalance?.name == "BTC"
                  ? "0.00001000"
                  : currentBalance?.name == "ETH"
                  ? "0.00100000"
                  : currentBalance?.name == "BNB"
                  ? "0.00250000"
                  : currentBalance?.name == "USDT"
                  ? "0.10"
                  : currentBalance?.name == "PACO"
                  ? "100"
                  : ""}
                &nbsp;
                {currentBalance?.name == "BNB" ? "WBNB" : currentBalance?.name}.
              </span>
            </div>

            <p className="text-xs text-gray-300">
              PLEASE ENSURE YOU MEET THE MINIMUM DEPOSIT AMOUNT TO AVOID FUND
              LOSS (NON-REFUNDABLE). THERE'S NO MAXIMUM DEPOSIT LIMIT, AND
              PACO.FINANCE DOESN'T CHARGE ANY FEES FOR DEPOSITS. KEEP IN MIND
              THAT DEPOSITS MAY EXPERIENCE DELAYS DUE TO NETWORK ACTIVITY.
            </p>
          </div>
          <div className="md:w-[30%] bg-white p-2 rounded-lg">
            <QRCode value={account?.publicKey} size={120} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Deposite;
