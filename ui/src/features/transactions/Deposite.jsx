import { AiFillWarning } from "react-icons/ai";
import Balance from "../../components/Balance";

function Deposite() {
  return (
    <>
      <h2 className="text-lg uppercase font-extrabold text-white">Deposite</h2>
      <Balance className="gap-4" />

      <div className="flex flex-col gap-3 pt-6 text-white">
        <strong className="text-lg">YOUR PACO DEPOSIT ADDRESS</strong>
        <strong className="text-sm text-gray-300">
          IMPORTANT: THIS ADDRESS ACCEPTS ONLY BEP-20 TOKENS ON BNB CHAIN
          MAINNET. SENDING OTHER COINS WILL RESULT IN A LOSS OF FUNDS. PLEASE
          COPY THE PACO ADDRESS:
        </strong>

        <input
          type="text"
          value="0xabb2fd93a9b896f276b2c79390498B905A452F25"
          className="bg-[#1f1d22] pt-4 focus:outline-none font-bold cursor-pointer p-2 rounded-lg border border-gray-600"
          readOnly
        />
        <div className="flex flex-col md:flex-row items-center gap-3 pt-6">
          <div className="space-y-4 md:w-[70%]">
            <div className="flex items-center gap-2 bg-[#323232] px-4 py-2 rounded-xl text-white">
              <AiFillWarning color="#ffcc00" size={20} />
              <span className="text-sm uppercase font-bold">
                MINIMUM DEPOSIT IS 100 PACO.
              </span>
            </div>

            <p className="text-xs text-gray-300">
              PLEASE ENSURE YOU MEET THE MINIMUM DEPOSIT AMOUNT TO AVOID FUND
              LOSS (NON-REFUNDABLE). THERE'S NO MAXIMUM DEPOSIT LIMIT, AND
              PACO.FINANCE DOESN'T CHARGE ANY FEES FOR PACO DEPOSITS. KEEP IN
              MIND THAT PACO DEPOSITS MAY EXPERIENCE DELAYS DUE TO NETWORK
              ACTIVITY.
            </p>
          </div>
          <div className="md:w-[30%] bg-white p-2 rounded-lg">
            <img src="/qr.png" alt="" className="w-[20rem] md:w-[30rem]" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Deposite;
