import { useEffect, useState } from "react";
import Control from "./Control";
import Footer from "./Footer";
import GameCard from "./GameCard";
import History from "./History";
import InforCard from "./InforCard";
import { useCreateGame } from "./useCreateGame";
import { useBalance } from "../../context/BalanceContext";

function DiceGame() {
  const [prediction, setPrediction] = useState(50);
  const [result, setResult] = useState(0);
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState("1.96X");
  const [payout, setPayout] = useState("0.00039200 BTC");
  const [rollType, setRollType] = useState("rollUnder");
  const [winChance, setWinChance] = useState(50);
  const [showError, setShowError] = useState("");
  const [betStatus, setBetStatus] = useState("");

  const [reFetchHistory, setReFetchHistory] = useState(false);
  const { create, isLoading } = useCreateGame();
  const { currentBalance } = useBalance();

  useEffect(() => {
    // same logic copy pase in backend
    if (rollType === "rollUnder") {
      setWinChance(Number(prediction));
      setMultiplier((100 / Number(prediction)) * (1 - 0.02));
      setPayout(betAmount * multiplier);
    } else {
      setWinChance(100 - Number(prediction) - 1);
      setMultiplier((100 / (100 - Number(prediction) - 1)) * (1 - 0.02));
      setPayout(betAmount * multiplier);
    }
  }, [prediction, betAmount, multiplier, rollType]);

  async function handleCahngeOFRoll(type = "rollUnder") {
    setRollType(type);
    if (type === "rollUnder" && prediction > 95) {
      setPrediction(95);
    } else if (type === "rollOver" && prediction < 4) {
      setPrediction(4);
    }
  }

  async function handleRoll() {
    if (!betAmount) setShowError("Bet amount is required");

    if (!betAmount || !prediction || !rollType) return;

    create(
      {
        paymentType: currentBalance?.name?.toLowerCase(),
        betAmount,
        prediction,
        rollType,
      },
      {
        onSuccess: (data) => {
          setResult(data.winNumber);
          setBetStatus(data.status);
          setReFetchHistory((reFetchHistory) => !reFetchHistory);
        },
      }
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-6 mb-40">
        <Control />
        <History reFetchHistory={reFetchHistory} />
        <GameCard
          prediction={prediction}
          setPrediction={setPrediction}
          result={result}
          onRoll={handleRoll}
          rollType={rollType}
          isLoading={isLoading}
          betStatus={betStatus}
        />
        <InforCard
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          multiplier={multiplier}
          setMultiplier={setMultiplier}
          payout={payout}
          setPayout={setPayout}
          rollType={rollType}
          setRollType={handleCahngeOFRoll}
          winChance={winChance}
          showError={showError}
          setShowError={setShowError}
        />
      </div>
      <Footer />
    </div>
  );
}

export default DiceGame;
