import { useEffect, useRef, useState } from "react";
import Control from "./Control";
import GameCard from "./GameCard";
import History from "./History";
import InforCard from "./InforCard";
import AutoBet from "./AutoBet";
import { useCreateGame } from "./useCreateGame";
import { useBalance } from "../../context/BalanceContext";
import { set } from "mongoose";

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
  const [stopToWin, setStopToWin] = useState("");
  const [stopToLoss, setStopToLoss] = useState("");
  const [maxBetAmount, setMaxBetAmount] = useState("");
  const [onWinReset, setOnWinReset] = useState("");
  const [onLossIncrease, setOnLossIncrease] = useState("");

  const [auto, setAuto] = useState(false);
  const [stopRoll, setStopRoll] = useState(false);

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
      if (!auto) {
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

        setStopRoll(false);
        return;
      }

      let i = 0;
      loopRef.current = setInterval(() => {
        if (numberOfBet > 0 && i >= numberOfBet) {
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
            },
          }
        );

        i++;

        // Loop logic goes here
      }, 1000); // Loop every 1 second
    }

    // Cleanup function to stop the loop
    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
      }
    };
  }, [stopRoll]);

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
    console.log("start roll");
  }
  function handleStopRoll() {
    setStopRoll(false);
    console.log("stop roll");
  }

  // useEffect(() => {
  //   if (stopRoll) {
  //     console.log("handle roll", stopRoll);
  //     if (!betAmount) return setShowError("Bet amount is required");

  //     if (!betAmount || !prediction || !rollType) return;

  //     let timeoutIndex;

  //     if (auto) {
  //       if (numberOfBet > 0) {
  //         const finiteBet = (i) => {
  //           if (i >= numberOfBet && !stopRoll) {
  //             console.log("stp roll");
  //             setStopRoll(false);
  //             clearTimeout(timeoutIndex);
  //             return;
  //           }
  //           console.log(stopRoll);
  //           console.log("i=", i);
  //           i++;

  //           timeoutIndex = setTimeout(() => finiteBet(i), 1000);
  //         };
  //         finiteBet(0);
  //       } else {
  //         const finiteBet = (i) => {
  //           if (!stopRoll) {
  //             setStopRoll(false);
  //             clearTimeout(timeoutIndex);
  //             return;
  //           }
  //           console.log("i=", i);

  //           timeoutIndex = setTimeout(() => finiteBet(i), 1000);
  //         };
  //         finiteBet(0);
  //       }
  //     } else {
  //       create(
  //         {
  //           paymentType: currentBalance?.name?.toLowerCase(),
  //           betAmount,
  //           prediction,
  //           rollType,
  //         },
  //         {
  //           onSuccess: (data) => {
  //             setResult(data.winNumber);
  //             setBetStatus(data.status);
  //             setReFetchHistory((reFetchHistory) => !reFetchHistory);
  //           },
  //         }
  //       );
  //     }
  //   }
  // }, [stopRoll]);

  console.log("stopRoll", stopRoll);

  const handleRoll = () => {
    let x = 100000;
    while (x) {
      console.log("handle roll", stopRoll);
      x--;
    }
  };
  // function handleRoll() {
  //   console.log("handle roll", stopRoll);
  //   if (!betAmount) return setShowError("Bet amount is required");

  //   if (!betAmount || !prediction || !rollType) return;

  //   if (auto) {
  //     if (numberOfBet > 0) {
  //       // for loop
  //       for (let i = 0; i < numberOfBet; i++) {
  //         console.log("i=", i);
  //       }
  //     } else {
  //       while (1) {
  //         // infinite loop
  //         console.log("infinite loop");
  //       }
  //     }
  //   } else {
  //     create(
  //       {
  //         paymentType: currentBalance?.name?.toLowerCase(),
  //         betAmount,
  //         prediction,
  //         rollType,
  //       },
  //       {
  //         onSuccess: (data) => {
  //           setResult(data.winNumber);
  //           setBetStatus(data.status);
  //           setReFetchHistory((reFetchHistory) => !reFetchHistory);
  //         },
  //       }
  //     );
  //   }
  //   setStopRoll(false);
  // }

  return (
    <div className="flex flex-col gap-6 mb-40">
      <Control />
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
        handleRoll={handleRoll}
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
