function StatItem({ img, title, isQuestion, value }) {
  return (
    <div className="bg-[#181734] dark:bg-[#120e1e] border border-[#121128] dark:border-[#0e0b17] shadow-md rounded-lg px-6 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={img} alt="" className="w-10" />
          <span className="uppercase text-xl font-thin">{title}</span>
        </div>
        {isQuestion && (
          <img src="/images/referral/question.png" alt="" className="w-7" />
        )}
      </div>
      <div className="self-center bg-[#292850] dark:bg-[#241c38] shadow-lg shadow-[#1f1e3d] dark:shadow-[#1d172d] w-[14rem] rounded-md p-4 flex justify-center items-center">
        {value}
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="m-4">
      <div className="grid grid-cols-1 tablet:grid-cols-4 gap-12">
        <StatItem
          title="Referrals"
          img="/images/referral/referral.png"
          value={253}
        />
        <StatItem
          title="Wager"
          img="/images/referral/stock.png"
          value="129,326$"
          isQuestion
        />
        <StatItem
          title="Total Earned"
          img="/images/referral/currency.png"
          value="129,326$"
          isQuestion
        />
        <StatItem
          title="Commission"
          img="/images/referral/money.png"
          value="129,326$"
          isQuestion
        />
      </div>
    </div>
  );
}

export default Stats;
