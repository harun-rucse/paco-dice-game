import Countdown from "react-countdown";

const formatNumber = (num) => (num < 10 ? `0${num}` : num);

function FaucetStats() {
  // Calculate the time until the next 11:00 PM
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 0, 0, 0);
  const timeUntilMidnight = midnight - now;

  const renderer = ({ hours, minutes, seconds }) => {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds
    )}`;
  };

  return (
    <div className="bg-[#24224a] dark:bg-[#3f345d] border border-[#3d3b72] dark:border-[#6a5d8f] p-3 rounded-lg flex flex-col tablet:flex-row gap-3 tablet:gap-0 items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="/images/paco.png" alt="" className="w-7" />
        <span className="uppercase laptop:text-lg">Faucet Tournament</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="uppercase laptop:text-lg">
          Prize pool: {"1M"} Paco
        </span>
        <img src="/images/paco.png" alt="" className="w-7" />
      </div>

      <div className="flex items-center gap-2 w-[14rem]">
        <img src="/images/timer.png" alt="" className="w-6" />
        <span className="uppercase laptop:text-lg">
          Time left:{" "}
          {
            <Countdown
              date={Date.now() + timeUntilMidnight}
              renderer={renderer}
            />
          }
        </span>
      </div>
    </div>
  );
}

export default FaucetStats;
