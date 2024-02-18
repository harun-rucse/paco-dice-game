import Countdown from "react-countdown";
import { numberFormat } from "../../utils/format";
import InfoCard from "./InfoCard";

const formatNumber = (num) => (num < 10 ? `0${num}` : num);

function PacoLottery() {
  // Calculate the time until the next 3:00 AM
  const now = new Date();
  const midnight = new Date();
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(3, 0, 0, 0);
  const timeUntilMidnight = midnight - now;

  const renderer = ({ hours, minutes, seconds }) => {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds
    )}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-white">
        <h2 className="uppercase text-xl md:text-3xl">Paco Lottery</h2>
        <img
          src="/icons/lottery_icon.png"
          alt=""
          className="h-[1.8rem] md:h-[2.4rem] object-contain"
        />
      </div>

      <div className="text-white gradient-lottery-info rounded-2xl px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
        <InfoCard
          title="Minor Jackpot"
          subTitle={numberFormat(323144988)}
          titleIcon="/icons/minor-jackpot.png"
          subTitleIcon="/tokens/paco.png"
          className="bg-[#1e132d] border border-[#8556e9] rounded-full px-4"
        />
        <InfoCard
          title="Paco Mega Jackpot"
          subTitle={numberFormat(2623144988)}
          titleIcon="/icons/ticket.png"
          subTitleIcon="/tokens/paco.png"
          className="bg-[#1e132d] border border-[#bd4dd1] rounded-full px-4"
        />
        <InfoCard
          title="Paco Burnt from lottery"
          subTitle={numberFormat(2623144)}
          titleIcon="/icons/fire.png"
          subTitleIcon="/tokens/paco.png"
          className="bg-[#1e132d] border border-[#ff9c47] rounded-full px-4"
        />
        <InfoCard
          title="Next Lottery Draw"
          subTitle={
            <Countdown
              date={Date.now() + timeUntilMidnight}
              renderer={renderer}
            />
          }
        />
        <InfoCard title="Tickets In Play" subTitle={numberFormat(104052985)} />
      </div>
    </div>
  );
}

export default PacoLottery;
