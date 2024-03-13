import Countdown from "react-countdown";
import { numberFormat } from "../../utils/format";
import InfoCard from "./InfoCard";
import useGetTicketStatistics from "./useGetTicketStatistics";
import LoadingSpinner from "../../components/LoadingSpinner";

const formatNumber = (num) => (num < 10 ? `0${num}` : num);

function PacoLottery() {
  const { isLoading, ticketStatistics } = useGetTicketStatistics();

  // Calculate the time until the next 3:00 PM
  const now = new Date();
  const midnight = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      15,
      0,
      0,
      0
    )
  );
  const timeUntilMidnight = midnight - now;

  const renderer = ({ hours, minutes, seconds }) => {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds
    )}`;
  };

  if (isLoading) return <LoadingSpinner className="h-[4rem]" />;

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
          subTitle={numberFormat(ticketStatistics.minorJackpot)}
          titleIcon="/icons/minor-jackpot.png"
          subTitleIcon="/tokens/paco.png"
          className="bg-[#1e132d] border border-[#8556e9] rounded-full px-4"
        />
        <InfoCard
          title="Paco Mega Jackpot"
          subTitle={numberFormat(ticketStatistics.megaJackpot)}
          titleIcon="/icons/ticket.png"
          subTitleIcon="/tokens/paco.png"
          className="bg-[#1e132d] border border-[#bd4dd1] rounded-full px-4"
        />
        <InfoCard
          title="Paco Burnt from lottery"
          subTitle={numberFormat(ticketStatistics.pacoBurnt)}
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
        <InfoCard
          title="Tickets In Play"
          subTitle={numberFormat(ticketStatistics.ticketsInPlay)}
        />
        <InfoCard
          title="Round"
          subTitle={`#${numberFormat(ticketStatistics.round)}`}
        />
      </div>
    </div>
  );
}

export default PacoLottery;
