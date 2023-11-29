import { useEffect, useRef, useState } from "react";
import Control from "./Control";
import GameCard from "./GameCard";
import History from "./History";
import InforCard from "./InforCard";
import AutoBet from "./AutoBet";
import { useCreateGame } from "./useCreateGame";
import { useBalance } from "../../context/BalanceContext";
import { useCurrentUser } from "../authentication/useCurrentUser";
import useGamesHistory from "./useGamesHistory";
import { getCoinPrice } from "../../utils/tokenPrice";
import toast from "react-hot-toast";
const winAudio = new Audio("/audio/win.mp3");
const loseAudio = new Audio("/audio/lose.mp3");

async function checkMaxBetAmount(amount, coinName) {
  console.log("coinName", coinName);
  if (coinName === "btc") {
    const _btcPrice = await getCoinPrice("btc");
    const _betedUsd = amount * _btcPrice;
    if (_betedUsd > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "usdt") {
    if (amount > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "eth") {
    const _ethPrice = await getCoinPrice("eth");
    const _betedUsd = amount * _ethPrice;
    console.log("_betedUsd", _betedUsd);
    if (_betedUsd > 100) {
      console.log("false");
      return false;
    } else {
      return true;
    }
  } else if (coinName === "bnb") {
    const _bnbPrice = await getCoinPrice("bnb");
    const _betedUsd = amount * _bnbPrice;
    if (_betedUsd > 100) {
      return false;
    } else {
      return true;
    }
  } else if (coinName === "paco") {
    if (amount > 100000000) {
      return false;
    } else {
      return true;
    }
  }
}

function DiceGame() {
  const loopRef = useRef();
  const [prediction, setPrediction] = useState(50);
  const [result, setResult] = useState(0);
  const [betAmount, setBetAmount] = useState(0);
  const [multiplier, setMultiplier] = useState("1.96X");
  const [payout, setPayout] = useState("0.00039200 BTC");
  const [rollType, setRollType] = useState("rollUnder");
  const [winChance, setWinChance] = useState(50);
  const [showError, setShowError] = useState("");
  const [betStatus, setBetStatus] = useState("");
  const [minBet] = useState("0.00000001");

  const [numberOfBet, setNumberOfBet] = useState(null);
  const [stopToWin, setStopToWin] = useState(null);
  const [stopToLoss, setStopToLoss] = useState(null);
  const [maxBetAmount, setMaxBetAmount] = useState(null);
  const [onWinReset, setOnWinReset] = useState(null);
  const [onLossIncrease, setOnLossIncrease] = useState(null);

  const [auto, setAuto] = useState(false);
  const [stopRoll, setStopRoll] = useState(false);
  const [playAudio, setPlayAudio] = useState(true);
  const [callTime, setCallTime] = useState(3000);
  const [histories, setHistories] = useState([]);

  // const [reFetchHistory, setReFetchHistory] = useState(false);
  const { create, isLoading } = useCreateGame();
  const { currentBalance } = useBalance();
  const { account } = useCurrentUser();
  const betAmountRef = useRef(betAmount);
  const rollRef = useRef(stopRoll);
  const payoutRef = useRef(payout);
  const { games, isLoading: isHistoryLoading } = useGamesHistory();

  useEffect(() => {
    if (games) {
      setHistories([...games].reverse());
    }
  }, [isHistoryLoading]);

  useEffect(() => {
    payoutRef.current = payout;
  }, [payout]);

  useEffect(() => {
    betAmountRef.current = betAmount;
    // bet amount need o be less than 100$ and balance
  }, [betAmount]);

  useEffect(() => {
    rollRef.current = stopRoll;
  }, [stopRoll]);

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
    let timer;

    if (rollRef.current) {
      // Start the loop

      let lossAmount = 0;
      let winAmount = 0;
      let initialBetAmount = betAmount;

      if (!auto) {
        // setTImeout
        timer = setTimeout(() => {
          const check = async () => {
            // check min bet amount
            if (betAmount < minBet) {
              setStopRoll(false);
              toast.error("Bet amount must be greater than 0.00000001");
              return;
            }
            const check = await checkMaxBetAmount(
              betAmount,
              currentBalance?.name?.toLowerCase()
            );
            console.log("check", check);
            if (!check) {
              setStopRoll(false);
              toast.error("Bet amount must be less than 100$");
              return;
            }
            create(
              {
                paymentType: currentBalance?.name?.toLowerCase(),
                betAmount: betAmountRef.current,
                prediction,
                rollType,
              },
              {
                onSuccess: (data) => {
                  setHistories((prev) => [
                    ...prev,
                    { winNumber: data.winNumber, status: data.status },
                  ]);
                  setResult(data.winNumber);
                  setBetStatus(data.status);
                  // setReFetchHistory((reFetchHistory) => !reFetchHistory);
                  if (data.status === "lost") {
                    // stop win audio if loss
                    winAudio.pause();
                    loseAudio.play();
                  } else {
                    // stop loss audio if win
                    loseAudio.pause();
                    winAudio.play();
                  }

                  setStopRoll(false);
                },
                onError: (error) => {
                  console.log(error);
                  setStopRoll(false);
                },
              }
            );
          };
          check();
        }, callTime);
      } else {
        let i = 0;
        const _numberOfBet = numberOfBet;
        loopRef.current = setInterval(() => {
          if (!_numberOfBet) {
            const check = async () => {
              if (betAmount < minBet) {
                setStopRoll(false);
                toast.error("Bet amount must be greater than 0.00000001");
                return;
              }
              const check = await checkMaxBetAmount(
                betAmount,
                currentBalance?.name?.toLowerCase()
              );
              if (!check) {
                setStopRoll(false);
                toast.error("Bet amount must be less than 100$");
                return;
              }
              if (
                maxBetAmount > 0 &&
                Number(betAmountRef.current) > Number(maxBetAmount)
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              console.log("betAmount", betAmountRef.current);

              console.log("total", winAmount - lossAmount);
              console.log("winAmount", winAmount);
              console.log("lossAmount", lossAmount);

              if (
                stopToLoss &&
                lossAmount > winAmount &&
                lossAmount - winAmount >= stopToLoss
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              if (
                stopToWin &&
                winAmount > lossAmount &&
                winAmount - lossAmount >= stopToWin
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              create(
                {
                  paymentType: currentBalance?.name?.toLowerCase(),
                  betAmount: betAmountRef.current,
                  prediction,
                  rollType,
                },
                {
                  onSuccess: (data) => {
                    setHistories((prev) => [
                      ...prev,
                      { winNumber: data.winNumber, status: data.status },
                    ]);
                    setResult(data.winNumber);
                    setBetStatus(data.status);
                    if (data.status === "lost") {
                      // play audio
                      winAudio.pause();
                      loseAudio.play();

                      lossAmount += Number(betAmountRef.current);
                      console.log("lossAmount", lossAmount);

                      if (!onLossIncrease)
                        setBetAmount(parseFloat(initialBetAmount).toFixed(8));
                      if (onLossIncrease) {
                        setBetAmount((betAmount) => {
                          return parseFloat(
                            Number(betAmount) +
                              (Number(betAmount) * Number(onLossIncrease)) / 100
                          ).toFixed(8);
                        });
                      }
                    }

                    if (data.status === "win") {
                      // play audio
                      loseAudio.pause();
                      winAudio.play();

                      winAmount +=
                        Number(payoutRef.current) -
                        Number(betAmountRef.current);
                      console.log("winAmount", winAmount);
                      // based on percentage of win amount set bet amount
                      if (onWinReset) {
                        setBetAmount((betAmount) => {
                          return parseFloat(
                            Number(betAmount) +
                              (Number(betAmount) * Number(onWinReset)) / 100
                          ).toFixed(8);
                        });
                      }

                      if (!onWinReset)
                        setBetAmount(parseFloat(initialBetAmount).toFixed(8));
                    }
                  },
                  onError: (error) => {
                    console.log("FAIL");
                    setStopRoll(false);
                    clearInterval(loopRef.current);
                  },
                }
              );
            };
            check();
          } else {
            const check = async () => {
              if (betAmount < minBet) {
                setStopRoll(false);
                toast.error("Bet amount must be greater than 0.00000001");
                return;
              }
              const check = await checkMaxBetAmount(
                betAmount,
                currentBalance?.name?.toLowerCase()
              );
              console.log("check", check);
              if (!check) {
                setStopRoll(false);
                toast.error("Bet amount must be less than 100$");
                return;
              }
              if (_numberOfBet > 0 && i >= _numberOfBet) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }
              if (
                maxBetAmount > 0 &&
                Number(betAmountRef.current) > Number(maxBetAmount)
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              if (maxBetAmount > 0 && betAmountRef.current > maxBetAmount) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              if (
                stopToLoss &&
                lossAmount > winAmount &&
                lossAmount - winAmount >= stopToLoss
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }
              if (
                stopToWin &&
                winAmount > lossAmount &&
                winAmount - lossAmount >= stopToWin
              ) {
                setStopRoll(false);
                clearInterval(loopRef.current);
                return;
              }

              create(
                {
                  paymentType: currentBalance?.name?.toLowerCase(),
                  betAmount: betAmountRef.current,
                  prediction,
                  rollType,
                },
                {
                  onSuccess: (data) => {
                    setNumberOfBet((numberOfBet) => numberOfBet - 1);
                    setHistories((prev) => [
                      ...prev,
                      { winNumber: data.winNumber, status: data.status },
                    ]);
                    setResult(data.winNumber);
                    setBetStatus(data.status);
                    // setReFetchHistory((reFetchHistory) => !reFetchHistory);
                    if (data.status === "lost") {
                      // play audio
                      winAudio.pause();
                      loseAudio.play();

                      lossAmount += betAmountRef.current;

                      if (!onLossIncrease)
                        setBetAmount(parseFloat(initialBetAmount).toFixed(8));
                      if (onLossIncrease) {
                        setBetAmount((betAmount) => {
                          return parseFloat(
                            Number(betAmount) +
                              (Number(betAmount) * Number(onLossIncrease)) / 100
                          ).toFixed(8);
                        });
                      }
                    }

                    if (data.status === "win") {
                      // play audio
                      loseAudio.pause();
                      winAudio.play();

                      winAmount +=
                        Number(payoutRef.current) -
                        Number(betAmountRef.current);
                      // based on percentage of win amount set bet amount
                      if (onWinReset) {
                        setBetAmount((betAmount) => {
                          return parseFloat(
                            Number(betAmount) +
                              (Number(betAmount) * Number(onWinReset)) / 100
                          ).toFixed(8);
                        });
                      }

                      if (!onWinReset)
                        setBetAmount(parseFloat(initialBetAmount).toFixed(8));
                    }
                  },
                }
              );
            };
            check();
          }

          i++;
        }, callTime); // Loop every 1 second
      }
    }

    // Cleanup function to stop the loop
    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
      }
      clearTimeout(timer);
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
      <Control
        playAudio={playAudio}
        setPlayAudio={setPlayAudio}
        setCallTime={setCallTime}
        stopRoll={stopRoll}
      />
      <History histories={histories} isLoading={isHistoryLoading} />
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
