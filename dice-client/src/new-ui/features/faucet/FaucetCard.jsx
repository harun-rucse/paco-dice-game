import BonusCard from "./BonusCard";
import FaucetStats from "./FaucetStats";
import LevelCard from "./LevelCard";

function FaucetCard() {
  return (
    <div className="p-2 space-y-4">
      <div className="flex flex-col laptop:flex-row items-start gap-8">
        <div className="w-full laptop:w-[70%]">
          <BonusCard />
        </div>

        <div className="w-full laptop:w-[30%]">
          <LevelCard />
        </div>
      </div>

      <FaucetStats />
    </div>
  );
}

export default FaucetCard;
