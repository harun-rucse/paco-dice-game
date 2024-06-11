import BonusCard from "./BonusCard";
import LevelCard from "./LevelCard";

function FaucetCard() {
  return (
    <div className="p-2 flex flex-col laptop:flex-row items-start gap-8">
      <div className="w-full laptop:w-[70%]">
        <BonusCard />
      </div>

      <div className="w-full laptop:w-[30%]">
        <LevelCard />
      </div>
    </div>
  );
}

export default FaucetCard;
