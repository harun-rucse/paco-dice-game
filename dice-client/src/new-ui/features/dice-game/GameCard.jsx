import ReactSlider from "react-slider";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import AnimateSpinner from "../../components/AnimateSpinner";

function GameCard({
  prediction,
  setPrediction,
  result,
  onStarRoll,
  onStopRoll,
  rollType,
  betStatus,
  stopRoll,
  winChance,
  setRollType,
  betAmount,
}) {
  const { isLoading: isLoading2, isAuthenticated } = useCurrentUser();

  function handleClick() {
    if (stopRoll) {
      onStopRoll();
    } else {
      onStarRoll();
    }
  }

  return (
    <div className="flex flex-col gap-5 desktop:gap-8">
      <div className="bg-gradient-to-r from-[#32214a] via-[#422d73] to-[#3a275c] rounded-[20px] border-2 border-[#491b7f61] px-4 desktop:px-16 py-8 relative z-50 flex flex-col gap-6 tablet:gap-12 items-center">
        <div className="flex gap-2 desktop:gap-0 items-center justify-between w-full desktop:pt-2">
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="uppercase text-white text-base desktop:text-xl">
              Prediction
            </p>
            <span className="bg-gradient-to-r from-[#3e1474] via-[#54298d] to-[#513082] flex justify-center items-center shadow-[0px_4px_4px_0px_#00000040] border-2 border-[#512782] rounded-2xl desktop:rounded-3xl w-[100px] h-[60px] desktop:w-[150px] desktop:h-[80px]">
              <p className="drop-shadow-[4px_8px_4px_#c235ce80] text-white text-3xl desktop:text-[4rem]">
                {prediction}
              </p>
            </span>
          </div>
          <div className="hidden tablet:flex flex-col items-center gap-1">
            <span className="uppercase tablet:text-lg desktop:text-xl">
              Win Chance
            </span>
            <span className="text-xl">{winChance}%</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <p className="uppercase text-white text-xl">Result</p>
            <span className="bg-gradient-to-r from-[#3e1474] via-[#54298d] to-[#513082] flex justify-center items-center shadow-[0px_4px_4px_0px_#00000040] border-2 border-[#512782] rounded-2xl desktop:rounded-3xl w-[100px] h-[60px] desktop:w-[150px] desktop:h-[80px]">
              <p
                className={`drop-shadow-[4px_8px_4px_#c235ce80] ${
                  betStatus === "win" ? "text-[#67C257]" : "text-[#d34950]"
                } text-3xl desktop:text-[4rem]`}
              >
                {result}
              </p>
            </span>
          </div>
        </div>

        <div className="flex tablet:hidden flex-col items-center pb-8">
          <span className="uppercase text-base">Win Chance</span>
          <span className="text-base">{winChance}%</span>
        </div>

        <div className="w-full pt-0 tablet:pt-10 desktop:pt-0">
          <ReactSlider
            className="customSlider"
            thumbClassName="customSlider-thumb"
            trackClassName={
              rollType === "rollUnder" ? "roll-under" : "roll-over"
            }
            min={rollType == "rollUnder" ? 1 : 4}
            max={rollType == "rollUnder" ? 95 : 98}
            defaultValue={0}
            value={prediction}
            onChange={(value) => setPrediction(value)}
          />
        </div>

        <div className="w-full flex justify-between items-center pt-8 desktop:pt-0">
          <button
            className={`uppercase text-sm desktop:text-xl ${
              rollType === "rollUnder" ? "bg-[#9c75d6]" : "bg-[#70509f]"
            } text-[#450e53] px-3 py-2 rounded-xl shadow-xl`}
            disabled={rollType === "rollUnder"}
            onClick={() => setRollType("rollUnder")}
          >
            Roll Under
          </button>
          <button
            className={`uppercase text-sm desktop:text-xl ${
              rollType === "rollOver" ? "bg-[#9c75d6]" : "bg-[#70509f]"
            } text-[#450e53] px-3 py-2 rounded-xl shadow-xl`}
            disabled={rollType === "rollOver"}
            onClick={() => setRollType("rollOver")}
          >
            Roll Over
          </button>
        </div>

        {stopRoll && <AnimateSpinner />}
      </div>

      <button
        className="self-center text-base desktop:text-lg uppercase button !bg-[#27c152] !border-[#158434] !px-8 desktop:!px-10 !py-2"
        onClick={handleClick}
        disabled={isLoading2 || !isAuthenticated || betAmount === 0}
      >
        {stopRoll ? "Stop" : "Roll"}
      </button>
    </div>
  );
}

export default GameCard;
