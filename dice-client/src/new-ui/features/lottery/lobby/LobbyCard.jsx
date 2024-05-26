import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useGetTicketSetting from "../useGetTicketSetting";
import InputBox from "./InputBox";
import { useDarkMode } from "../../../../context/DarkModeContext";

function LobbyCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, ticketSetting } = useGetTicketSetting();
  const { isDarkMode } = useDarkMode();

  // delete round and page params from useSearchParams hook
  useEffect(() => {
    searchParams.delete("round");
    searchParams.delete("page");

    setSearchParams(searchParams);
  }, []);

  if (isLoading) return <LoadingSpinner className="h-[6rem]" />;

  return (
    <div>
      <div className="flex flex-col tablet:flex-row justify-between items-center gap-6 tablet:gap-4 desktop:gap-32 px-4 tablet:px-8">
        <InputBox
          label="Standard ticket"
          type="STANDARD"
          price={ticketSetting?.["STANDARD"]}
          total={true}
          icon="/icons/minor-jackpot.png"
        />
        <InputBox
          label="Mega ticket"
          type="MEGA"
          price={ticketSetting?.["MEGA"]}
          total={true}
          icon="/icons/ticket.png"
        />
      </div>

      <div
        className={
          isDarkMode
            ? "lottery-divider-dark mt-6 mb-2"
            : "lottery-divider mt-6 mb-2"
        }
      />

      <div className="flex flex-col tablet:flex-row text-white items-start justify-between gap-0 pb-6">
        <div className="w-full h-full">
          <div className="bg-[#323057] dark:bg-[#6f3977] rounded-l-xl pl-4 laptop:pl-8 py-4 tablet:h-[34rem] laptop:h-[26rem]">
            <h2 className="uppercase text-xl tablet:text-2xl mb-4">Rules</h2>
            <ul className="text-sm tablet:text-base font-thin list-disc ml-4">
              <li>Players purchase tickets.</li>
              <li>
                A random draw determines outcomes based on winning chances.
              </li>
              <li>Prize Distribution:</li>
              <li>
                Players receive prizes according to the winning tier of each
                ticket.
              </li>
              <li>Each ticket is associated with a specific winning tier.</li>
              <li>Note:</li>
              <li>Mega Jackpot offers a chance for a substantial win.</li>
              <li>Players should be aware of costs and winning chances.</li>
              <li>Fairness and Transparency:</li>
              <li>
                Winning chances and ticket prices are clearly communicated for
                transparency and fairness.
              </li>
              <li>Prizes are distributed at 3 pm UTC every day</li>
            </ul>
          </div>

          <div className="flex flex-col ml-4 laptop:w-[60%] mt-8 tablet:mt-12">
            <h2 className="uppercase text-center text-xl tablet:text-2xl mb-2">
              Mega Jackpot Feature
            </h2>
            <span className="text-sm tablet:text-base">
              The Mega Jackpot feature is activated by purchasing MEGA lottery
              tickets priced at 200 PACO tokens each. The mega jackpot winner is
              entitled to up to 80% of the total mega jackpot, while 20% of the
              jackpot is consistently rolled over to the next round,
              irrespective of the number of jackpot winners.
            </span>
          </div>
        </div>
        <div className="w-full space-y-8 mt-8 tablet:mt-0">
          <div className="text-center bg-[#323057] dark:bg-[#6f3977] rounded-r-xl pr-4 laptop:pr-8 py-4 tablet:h-[34rem] laptop:h-[26rem]">
            <h2 className="uppercase text-xl tablet:text-2xl mb-2">
              Prize Table
            </h2>
            <div className="text-xs tablet:text-base">
              <p>25% chance to win 150 tokens.</p>
              <p>3% chance to win 750 tokens.</p>
              <p>0.25% chance to win 2,500 tokens.</p>
              <p>0.035% chance to win 5,000 tokens.</p>
              <p>0.005% chance to win 10,000 tokens.</p>
              <p>0.00395% chance to win 100,000 tokens.</p>
              <p>0.000595 chance to win 1,000,000 tokens.</p>
              <p>0.0000645% chance to win 10,000,000 tokens.</p>
              <p>0.00000395% chance to win 100,000,000 tokens.</p>
              <p>0.000000435% chance to win 1,000,000,000 tokens.</p>
              <p>0.0000001% chance to win 50% of the minor jackpot.</p>
              <p>0.00000005% chance to win 80% of the minor jackpot.</p>
              <p>0.000000025% chance to win 50% of the mega jackpot.</p>
              <p>0.00000001495% chance to win 80% of the mega jackpot.</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="uppercase text-xl tablet:text-2xl mb-2">
              Lottery Distribution
            </h2>
            <div className="text-xs tablet:text-base">
              <p>
                Lost lottery tickets are used to cover prizes. Any remaining
                funds distributed accordingly:
              </p>
              <p>60% goes to the revenue-sharing pool</p>
              <p>15% goes to the mega jackpot</p>
              <p>5% goes to the minor jackpot</p>
              <p>1% goes to the reserve</p>
              <p>1.5% goes to bonuses</p>
              <p>17% Team</p>
              <p>0.25% burn</p>
              <p>0.25 % fee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LobbyCard;
