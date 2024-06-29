import ProgressBar from "./ProgressBar";
import TextBox from "./TextBox";
import { formatTime } from "./../../../utils/format";
import { divide } from "../../../utils/decimal";

function TimeLaps({ time, isLevelCard }) {
  return (
    <span className="w-[5.2rem] text-center">
      {isLevelCard ? `${time}x` : formatTime(time)}
    </span>
  );
}

function SliderBox({
  rewards,
  secondsElapsed,
  progressWidth,
  lastMultiplier,
  isLevelCard = false,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {rewards.map((reward, index) => (
          <TextBox
            key={index}
            amount={
              isLevelCard && secondsElapsed >= reward.time
                ? divide(reward.coins, lastMultiplier)
                : reward.coins
            }
            isCompleted={secondsElapsed >= reward.time}
            className={
              isLevelCard
                ? "w-[3.5rem] tablet:w-[5rem] px-2"
                : "w-[2.8rem] tablet:w-[5.2rem]"
            }
          />
        ))}
      </div>

      <ProgressBar progressWidth={progressWidth} />

      <div className="flex items-center justify-between">
        {rewards.map((reward, index) => (
          <TimeLaps key={index} time={reward.time} isLevelCard={isLevelCard} />
        ))}
      </div>
    </div>
  );
}

export default SliderBox;
