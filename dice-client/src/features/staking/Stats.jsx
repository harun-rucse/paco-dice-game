import Countdown from "react-countdown";
import StatItem from "./StatItem";
import { numberFormat } from "../../utils/format";

const formatNumber = (num) => (num < 10 ? `0${num}` : num);

function Stats() {
  // Calculate the time until the next 12:00 AM
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight - now;

  const renderer = ({ hours, minutes, seconds }) => {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds
    )}`;
  };

  return (
    <div className="bg-[#3c2f61] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <StatItem title="Total next payout" subTitle="$275,08" />
      <StatItem title="Next Paco burn" subTitle={numberFormat(0)} icon={true} />
      <StatItem
        title="Trigger countdown"
        subTitle={
          <Countdown
            date={Date.now() + timeUntilMidnight}
            renderer={renderer}
          />
        }
      />
    </div>
  );
}

export default Stats;
