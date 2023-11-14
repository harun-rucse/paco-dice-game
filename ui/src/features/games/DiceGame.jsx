import { useEffect, useRef, useState } from "react";
import Control from "./Control";
import GameCard from "./GameCard";
import History from "./History";
import InforCard from "./InforCard";
import AutoBet from "./AutoBet";
import { useCreateGame } from "./useCreateGame";
import { useBalance } from "../../context/BalanceContext";

const winAudio = new Audio("/audio/win.mp3");
const loseAudio = new Audio("/audio/lose.mp3");

function DiceGame() {
  const loopRef = useRef();
  const [prediction, setPrediction] = useState(50);
  const [result, setResult] = useState(0);
  const [betAmount, setBetAmount] = useState("");
  const [multiplier, setMultiplier] = useState("1.96X");
  const [payout, setPayout] = useState("0.00039200 BTC");
  const [rollType, setRollType] = useState("rollUnder");
  const [winChance, setWinChance] = useState(50);
  const [showError, setShowError] = useState("");
  const [betStatus, setBetStatus] = useState("");

  const [numberOfBet, setNumberOfBet] = useState(null);
  const [stopToWin, setStopToWin] = useState(null);
  const [stopToLoss, setStopToLoss] = useState(null);
  const [maxBetAmount, setMaxBetAmount] = useState(null);
  const [onWinReset, setOnWinReset] = useState(null);
  const [onLossIncrease, setOnLossIncrease] = useState(null);

  const [auto, setAuto] = useState(false);
  const [stopRoll, setStopRoll] = useState(false);
  const [playAudio, setPlayAudio] = useState(true);

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

  useEffect(() => {
    if (stopRoll) {
      // Start the loop

      let lossAmount = 0;
      let winAmount = 0;
      let initialBetAmount = betAmount;

      if (!auto) {
        loopRef.current = setInterval(() => {
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
                if (data.status === "lost") {
                  // stop win audio if loss
                  winAudio.pause();
                  loseAudio.play();
                } else {
                  // stop loss audio if win
                  loseAudio.pause();
                  winAudio.play();
                }
              },
            }
          );
          clearInterval(loopRef.current);
          setStopRoll(false);
        }, 1000);

        return;
      }

      let i = 0;
      loopRef.current = setInterval(() => {
        if (numberOfBet > 0 && i >= numberOfBet) {
          setStopRoll(false);
          clearInterval(loopRef.current);
          return;
        }

        if (!numberOfBet) {
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
                if (data.status === "lost") {
                  // play audio
                  winAudio.pause();
                  loseAudio.play();

                  lossAmount += betAmount;
                  if (onWinReset) setBetAmount(initialBetAmount);

                  if (onLossIncrease) {
                    setBetAmount((betAmount) => {
                      return betAmount + (betAmount * onLossIncrease) / 100;
                    });
                  }
                }

                if (data.status === "win") {
                  // play audio
                  loseAudio.pause();
                  winAudio.play();

                  winAmount += payout - betAmount;
                  // based on percentage of win amount set bet amount
                  if (onWinReset) {
                    setBetAmount((betAmount) => {
                      return betAmount + (betAmount * onWinReset) / 100;
                    });
                  }

                  if (onLossIncrease) setBetAmount(initialBetAmount);
                }
              },
            }
          );
        }

        if (maxBetAmount > 0 && betAmount > maxBetAmount) {
          setStopRoll(false);
          clearInterval(loopRef.current);
          return;
        }

        if (stopToLoss && lossAmount >= stopToLoss) {
          setStopRoll(false);
          clearInterval(loopRef.current);
          return;
        }

        if (stopToWin && winAmount >= stopToWin) {
          setStopRoll(false);
          clearInterval(loopRef.current);
          return;
        }
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
              if (data.status === "lost") {
                // play audio
                winAudio.pause();
                loseAudio.play();

                lossAmount += betAmount;
                if (onWinReset) setBetAmount(initialBetAmount);

                if (onLossIncrease) {
                  setBetAmount((betAmount) => {
                    return betAmount + (betAmount * onLossIncrease) / 100;
                  });
                }
              }

              if (data.status === "win") {
                // play audio
                loseAudio.pause();
                winAudio.play();

                winAmount += payout - betAmount;
                // based on percentage of win amount set bet amount
                if (onWinReset) {
                  setBetAmount((betAmount) => {
                    return betAmount + (betAmount * onWinReset) / 100;
                  });
                }

                if (onLossIncrease) setBetAmount(initialBetAmount);
              }
            },
          }
        );

        i++;
      }, 1000); // Loop every 1 second
    }

    // Cleanup function to stop the loop
    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
      }
    };
  }, [stopRoll]);

  // controll audio
  useEffect(() => {
    if (playAudio) {
      winAudio.volume = 0.8;
      loseAudio.volume = 0.8;
    } else {
      winAudio.volume = 0;
      loseAudio.volume = 0;
    }
  }, [playAudio]);

  async function handleCahngeOFRoll(type = "rollUnder") {
    setRollType(type);
    if (type === "rollUnder" && prediction > 95) {
      setPrediction(95);
    } else if (type === "rollOver" && prediction < 4) {
      setPrediction(4);
    }
  }

  function handleStartRoll() {
    setStopRoll(true);
    // console.log("start roll");
  }
  function handleStopRoll() {
    setStopRoll(false);
    // console.log("stop roll");
  }

  return (
    <div className="flex flex-col gap-6 mb-40">
      <Control playAudio={playAudio} setPlayAudio={setPlayAudio} />
      <History reFetchHistory={reFetchHistory} />
      <GameCard
        prediction={prediction}
        setPrediction={setPrediction}
        result={result}
        onStarRoll={handleStartRoll}
        onStopRoll={handleStopRoll}
        rollType={rollType}
        isLoading={isLoading}
        betStatus={betStatus}
        stopRoll={stopRoll}
        setStopRoll={setStopRoll}
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
        setAuto={setAuto}
      />
      <AutoBet
        numberOfBet={numberOfBet}
        setNumberOfBet={setNumberOfBet}
        stopToWin={stopToWin}
        setStopToWin={setStopToWin}
        stopToLoss={stopToLoss}
        setStopToLoss={setStopToLoss}
        maxBetAmount={maxBetAmount}
        setMaxBetAmount={setMaxBetAmount}
        onWinReset={onWinReset}
        setOnWinReset={setOnWinReset}
        onLossIncrease={onLossIncrease}
        setOnLossIncrease={setOnLossIncrease}
      />
    </div>
  );
}

export default DiceGame;
