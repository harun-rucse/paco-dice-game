import StatItem from "./StatItem";

function Stats() {
  return (
    <div className="bg-[#3c2f61] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <StatItem title="Total next payout" subTitle="$275,08" />
      <StatItem title="Next Paco burn" subTitle="2 623 144" icon={true} />
      <StatItem title="Trigger countdown" subTitle="08:14:24" />
    </div>
  );
}

export default Stats;
