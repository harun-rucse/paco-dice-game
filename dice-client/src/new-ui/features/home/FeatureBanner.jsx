import { Link } from "react-router-dom";
import { cn } from "../../../utils";
import { numberFormat } from "../../../utils/format";
import useGetTicketStatistics from "../lottery/useGetTicketStatistics";

function InfoCard({ title, subTitle, titleIcon, subTitleIcon, className }) {
  return (
    <div className="space-y-0 desktop:space-y-0">
      <div className="hidden tablet:flex items-center gap-2">
        <p className="uppercase text-sm tablet:text-lg text-[#b4b3b3]">
          {title}
        </p>
        {titleIcon && <img src={titleIcon} alt="icon" className="w-[1.6rem]" />}
      </div>
      <div
        className={cn(
          "flex items-center gap-3 bg-[#1e132d] border border-[#8556e9] rounded-full",
          className
        )}
      >
        {subTitleIcon && (
          <img
            src={subTitleIcon}
            alt=""
            className="w-[1.4rem] tablet:w-[1.8rem]"
          />
        )}
        <strong className="font-medium text-xs tablet:text-lg">
          {subTitle}
        </strong>
      </div>
    </div>
  );
}

function FeatureBanner() {
  const { isLoading, ticketStatistics } = useGetTicketStatistics();

  return (
    <div className="pt-8 tablet:pt-10 desktop:pt-20 pb-10 px-4 desktop:px-10">
      <h2 className="uppercase text-lg tablet:text-2xl">Featured</h2>
      <div className="mt-2 tablet:mt-6">
        <Link to="/lottery">
          <div className="relative">
            <img
              src="/images/lottery-banner.png"
              alt=""
              className="hidden tablet:block overflow-hidden h-[8rem] w-full tablet:h-full object-fill tablet:object-contain rounded-xl tablet:rounded-2xl"
            />
            <img
              src="/images/lottery-banner-sm.png"
              alt=""
              className="block tablet:hidden overflow-hidden tablet:h-full object-contain rounded-xl tablet:rounded-2xl"
            />
            <div className="absolute w-full top-[55%] tablet:top-[50%] left-2 tablet:left-8 laptop:top-[55%] laptop:left-12 desktop:top-[60%] desktop:left-20 flex items-center gap-2 tablet:gap-6">
              <InfoCard
                title="Minor Jackpot"
                subTitle={
                  isLoading
                    ? "Loading..."
                    : numberFormat(ticketStatistics?.minorJackpot)
                }
                titleIcon="/icons/minor-jackpot.png"
                subTitleIcon="/tokens/paco.png"
                className="bg-[#1e132d] border border-[#8556e9] rounded-full text-sm tablet:text-lg px-4 tablet:px-8"
              />
              <InfoCard
                title="Paco Mega Jackpot"
                subTitle={numberFormat(ticketStatistics?.megaJackpot)}
                titleIcon="/icons/ticket.png"
                subTitleIcon="/tokens/paco.png"
                className="bg-[#1e132d] border border-[#bd4dd1] rounded-full text-sm tablet:text-lg px-4 tablet:px-8"
              />
            </div>
          </div>
        </Link>
        <div className="flex px-1 gap-4 tablet:gap-6 desktop:gap-8 mt-2 tablet:mt-6 desktop:mt-8">
          <Link to="/dice">
            <img
              src="/images/dice-banner.png"
              alt=""
              className="hidden tablet:block overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
            <img
              src="/images/dice-banner-sm.png"
              alt=""
              className="block tablet:hidden overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
          </Link>
          <Link to="/staking">
            <img
              src="/images/staking-banner.png"
              alt=""
              className="hidden tablet:block overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
            <img
              src="/images/staking-banner-sm.png"
              alt=""
              className="block tablet:hidden overflow-hidden h-[4rem] tablet:h-[8rem] desktop:h-[16rem] object-contain rounded-lg tablet:rounded-2xl"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeatureBanner;
