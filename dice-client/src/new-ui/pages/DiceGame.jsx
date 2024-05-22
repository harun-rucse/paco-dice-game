import GameInterface from "../features/dice-game/GameInterface";
import BetHistoryTable from "../features/dice-game/BetHistoryTable";
import { useEffect } from "react";

function Dice() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 desktop:p-8 space-y-12 pb-36 tablet:pb-48 laptop:pb-52 desktop:pb-56">
      <GameInterface />
      <BetHistoryTable />
    </div>
  );
}

export default Dice;
