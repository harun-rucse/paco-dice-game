import { useState } from "react";
import { numberFormat } from "../../../utils/format";
import CommissionDetailsInfo from "./CommissionDetailsInfo";
import useGetReferralStats from "./useGetReferralStats";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";
import { addition, multiply } from "../../../utils/decimal";

function StatItem({
  img,
  title,
  isQuestion,
  value,
  detailsValue,
  openDetailsName,
  handleClick,
  isLoading,
  price,
}) {
  let totalUsd = 0;
  if (detailsValue && price) {
    const pacoUsd = multiply(detailsValue?.paco, price?.paco);
    const btcUsd = multiply(detailsValue?.btc, price?.btc);
    const ethUsd = multiply(detailsValue?.eth, price?.eth);
    const usdtUsd = multiply(detailsValue?.usdt, price?.usdt);
    const bnbUsd = multiply(detailsValue?.bnb, price?.bnb);

    totalUsd = addition(pacoUsd, btcUsd, ethUsd, usdtUsd, bnbUsd);
  }

  return (
    <div className="bg-[#181734] dark:bg-[#120e1e] border border-[#121128] dark:border-[#0e0b17] shadow-md rounded-lg px-4 tablet:px-6 laptop:px-1 desktop:px-6 py-4 tablet:py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={img} alt="" className="w-7 tablet:w-10" />
          <span className="uppercase tablet:text-xl font-thin">{title}</span>
        </div>
        {isQuestion && (
          <div className="relative">
            <button onClick={() => handleClick(title)}>
              <img
                src="/images/referral/question.png"
                alt=""
                className="w-6 tablet:w-7"
              />
            </button>
            {openDetailsName === title && (
              <div className="absolute top-9 right-0 z-[9999]">
                <CommissionDetailsInfo
                  value={detailsValue}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="self-center bg-[#292850] dark:bg-[#241c38] shadow-lg shadow-[#1f1e3d] dark:shadow-[#1d172d] w-[14rem] laptop:w-[11rem] desktop:w-[14rem] rounded-md p-3 tablet:p-4 flex justify-center items-center">
        {value ? value : `${numberFormat(totalUsd)}$`}
      </div>
    </div>
  );
}

function Stats() {
  const [openDetailsName, setOpenDetailsName] = useState("");

  const { isLoading, data } = useGetReferralStats();
  const { isLoading: isFetchingPrice, price } = useGetCoinPrice();

  function handleClick(name) {
    if (openDetailsName) {
      setOpenDetailsName("");
    } else {
      setOpenDetailsName(name);
    }
  }

  return (
    <div className="m-2 tablet:m-4">
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 gap-6 tablet:gap-6 laptop:gap-4 desktop:gap-12">
        <StatItem
          title="Referrals"
          img="/images/referral/referral.png"
          value={numberFormat(data?.totalReferral)}
        />
        <StatItem
          title="Wager"
          img="/images/referral/stock.png"
          detailsValue={data?.wagered}
          openDetailsName={openDetailsName}
          handleClick={handleClick}
          isLoading={isLoading || isFetchingPrice}
          isQuestion
          price={price}
        />
        <StatItem
          title="Total Earned"
          img="/images/referral/currency.png"
          detailsValue={data?.totalEarned}
          openDetailsName={openDetailsName}
          handleClick={handleClick}
          isLoading={isLoading || isFetchingPrice}
          isQuestion
          price={price}
        />
        <StatItem
          title="Commission"
          img="/images/referral/money.png"
          detailsValue={data?.commission}
          openDetailsName={openDetailsName}
          handleClick={handleClick}
          isLoading={isLoading || isFetchingPrice}
          isQuestion
          price={price}
        />
      </div>
    </div>
  );
}

export default Stats;
