import BonusCard from "./BonusCard";
import FaucetStats from "./FaucetStats";
import FaucetTable from "./FaucetTable";
import LevelCard from "./LevelCard";

function FaucetCard() {
  return (
    <div className="p-2 space-y-4">
      <div className="flex flex-col laptop:flex-row items-start gap-8 laptop:gap-4 desktop:gap-8">
        <div className="w-full laptop:w-[65%] desktop:w-[70%]">
          <BonusCard />
        </div>

        <div className="w-full laptop:w-[35%] desktop:w-[30%]">
          <LevelCard />
        </div>
      </div>

      <FaucetStats />
      <FaucetTable />
    </div>
  );
}

export default FaucetCard;
