import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import toast from "react-hot-toast";
import ManualBet from "./ManualBet";
import AutoBet from "./AutoBet";
import GameHistory from "./GameHistory";
import GameCard from "./GameCard";
import TabHeader from "./TabHeader";
import useGamesHistory from "./useGamesHistory";
import { useCreateGame } from "./useCreateGame";
import { useBalance } from "../../../context/BalanceContext";
import Control from "./Control";
import LiveChart from "./LiveChart";
import useGetCoinPrice from "../../../hooks/useGetCoinPrice";
const winAudio = new Audio("/audio/win.mp3");
const loseAudio = new Audio("/audio/lose.mp3");
import * as decimal from "../../../utils/decimal";

async function checkMaxBetAmount(amount, coinName, price) {
  // console.log("coinName", coinName, amount);
  if (coinName === "btc") {
    const _btcPrice = price[coinName];
    const _betedUsd = parseFloat(amount) * _btcPrice;

    return _betedUsd > 100 ? false : true;
  } else if (coinName === "usdt") {
    return parseFloat(amount) > 100 ? false : true;
  } else if (coinName === "eth") {
    const _ethPrice = price[coinName];
    const _betedUsd = parseFloat(amount) * _ethPrice;

    return _betedUsd > 100 ? false : true;
  } else if (coinName === "bnb") {
    const _bnbPrice = price[coinName];
    const _betedUsd = parseFloat(amount) * _bnbPrice;

    return _betedUsd > 100 ? false : true;
  } else if (coinName === "paco") {
    return parseFloat(amount) > 100000000 ? false : true;
  }
}

function GameInterface() {
  const [showLiveChart, setShowLiveChart] = useState(false);
  const [tab, setTab] = useState("manual");
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
  const [boost, setBoost] = useState(false);
  const [callTime, setCallTime] = useState(300);
  const [histories, setHistories] = useState([]);
  const [totalWins, setTotalWins] = useState(0);
  const [totalProfit, setTotalProfit] = useState({
    btc: 0,
    usdt: 0,
    paco: 0,
    eth: 0,
    bnb: 0,
  });
  const [totalLoss, setTotalLoss] = useState(0);
  const [totalWager, setTotalWager] = useState({
    btc: 0,
    usdt: 0,
    paco: 0,
    eth: 0,
    bnb: 0,
  });

  const [defaultPosition, setDefaultPosition] = useState({
    x: 0,
    y: 0,
  });

  const { create, isLoading } = useCreateGame();
  const { currentBalance } = useBalance();
  const betAmountRef = useRef(betAmount);
  const rollRef = useRef(stopRoll);
  const payoutRef = useRef(payout);
  const { games, isLoading: isHistoryLoading } = useGamesHistory();

  const { price, isLoading: isFetchingPrice } = useGetCoinPrice();

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
    if (maxBetAmount && betAmount) {
      if (Number(maxBetAmount) < Number(betAmount)) {
        setBetAmount(parseFloat(maxBetAmount).toFixed(8));
      }
    }
  }, [betAmount]);

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
              currentBalance?.name?.toLowerCase(),
              price
            );
            // console.log("check", check);
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
                    setTotalLoss((prev) => prev + 1);
                    setTotalWager((prev) => ({
                      ...prev,
                      [currentBalance?.name?.toLowerCase()]: decimal.addition(
                        prev[currentBalance?.name?.toLowerCase()],
                        data.betAmount
                      ),
                    }));
                  } else {
                    // stop loss audio if win
                    loseAudio.pause();
                    winAudio.play();
                    setTotalWins((prev) => prev + 1);
                    setTotalProfit((prev) => ({
                      ...prev,
                      [currentBalance?.name?.toLowerCase()]: decimal.addition(
                        prev[currentBalance?.name?.toLowerCase()],
                        data.rewardAmount
                      ),
                    }));
                  }

                  setStopRoll(false);
                },
                onError: (error) => {
                  // console.log(error);
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
                currentBalance?.name?.toLowerCase(),
                price
              );
              if (!check) {
                setStopRoll(false);
                toast.error("Bet amount must be less than 100$");
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
                      setTotalLoss((prev) => prev + 1);
                      setTotalWager((prev) => ({
                        ...prev,
                        [currentBalance?.name?.toLowerCase()]: decimal.addition(
                          prev[currentBalance?.name?.toLowerCase()],
                          data.betAmount
                        ),
                      }));

                      lossAmount += Number(betAmountRef.current);
                      // console.log("lossAmount", lossAmount);

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
                      setTotalWins((prev) => prev + 1);
                      setTotalProfit((prev) => ({
                        ...prev,
                        [currentBalance?.name?.toLowerCase()]: decimal.addition(
                          prev[currentBalance?.name?.toLowerCase()],
                          data.rewardAmount
                        ),
                      }));

                      winAmount +=
                        Number(payoutRef.current) -
                        Number(betAmountRef.current);
                      // console.log("winAmount", winAmount);
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
                    // console.log("FAIL");
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
                currentBalance?.name?.toLowerCase(),
                price
              );
              // console.log("check", check);
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
                      setTotalLoss((prev) => prev + 1);
                      setTotalWager((prev) => ({
                        ...prev,
                        [currentBalance?.name?.toLowerCase()]: decimal.addition(
                          prev[currentBalance?.name?.toLowerCase()],
                          data.betAmount
                        ),
                      }));

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
                      setTotalWins((prev) => prev + 1);
                      setTotalProfit((prev) => ({
                        ...prev,
                        [currentBalance?.name?.toLowerCase()]: decimal.addition(
                          prev[currentBalance?.name?.toLowerCase()],
                          data.rewardAmount
                        ),
                      }));

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

  // control audio
  useEffect(() => {
    if (playAudio) {
      winAudio.volume = 0.8;
      loseAudio.volume = 0.8;
    } else {
      winAudio.volume = 0;
      loseAudio.volume = 0;
    }
  }, [playAudio]);

  // Set auto bet
  useEffect(() => {
    if (tab === "auto") {
      setAuto(true);
      setBetAmount("");
      setNumberOfBet("");
      setOnWinReset("");
      setOnLossIncrease("");
      setStopToWin("");
      setStopToLoss("");
    } else {
      setAuto(false);
      setBetAmount("");
      setNumberOfBet("");
      setOnWinReset("");
      setOnLossIncrease("");
      setStopToWin("");
      setStopToLoss("");
    }
  }, [tab]);

  useEffect(() => {
    if (!stopRoll) setNumberOfBet(0);
  }, [stopRoll]);

  async function handleChangeOfRoll(type = "rollUnder") {
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

  const handleDrag = (e, ui) => {
    const { x, y } = defaultPosition;

    setDefaultPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
  };

  return (
    <div>
      <div className="flex flex-col desktop:flex-row gap-8">
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col-reverse tablet:flex-row flex-1 border-b-4 border-[#38346d] dark:border-[#4c3670]">
            <div className="bg-[#38346d] dark:bg-[#462f6b] w-full laptop:w-[20rem] desktop:w-[24rem] h-[37rem] tablet:h-[40rem] desktop:h-[38rem] relative">
              <TabHeader tab={tab} setTab={setTab} />

              {tab === "manual" ? (
                <ManualBet
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  payout={payout}
                  setPayout={setPayout}
                  showError={showError}
                  setShowError={setShowError}
                />
              ) : (
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
                  betAmount={betAmount}
                  setBetAmount={setBetAmount}
                  showError={showError}
                  setShowError={setShowError}
                  payout={payout}
                  setPayout={setPayout}
                />
              )}

              {showLiveChart && (
                <Draggable
                  defaultPosition={defaultPosition}
                  grid={[25, 25]}
                  scale={1}
                  onDrag={handleDrag}
                >
                  <div className="block desktop:hidden absolute top-[12rem] left-0 bg-[#24224a] dark:bg-[#291f40] w-[95%] tablet:w-[15.3rem] laptop:w-[18rem] rounded-xl mx-2 my-4 laptop:m-4 z-[50] cursor-pointer">
                    <LiveChart
                      setShowLiveChart={setShowLiveChart}
                      totalProfit={totalProfit}
                      setTotalProfit={setTotalProfit}
                      totalWins={totalWins}
                      setTotalWins={setTotalWins}
                      totalWager={totalWager}
                      setTotalWager={setTotalWager}
                      totalLoss={totalLoss}
                      setTotalLoss={setTotalLoss}
                      tokenPrice={price}
                    />
                  </div>
                </Draggable>
              )}
            </div>
            <div className="bg-[#24224a] dark:bg-[#291f40] flex-1 px-2 laptop:px-6 py-4 w-full laptop:w-[10rem] space-y-4 rounded-t-xl laptop:rounded-tl-none laptop:rounded-tr-xl">
              <GameHistory histories={histories} isLoading={isHistoryLoading} />
              <GameCard
                prediction={prediction}
                setPrediction={setPrediction}
                result={result}
                onStarRoll={handleStartRoll}
                onStopRoll={handleStopRoll}
                rollType={rollType}
                setRollType={handleChangeOfRoll}
                isLoading={isLoading || isFetchingPrice}
                betStatus={betStatus}
                stopRoll={stopRoll}
                setStopRoll={setStopRoll}
                winChance={winChance}
                betAmount={betAmount}
              />
            </div>
          </div>
          <Control
            playAudio={playAudio}
            setPlayAudio={setPlayAudio}
            boost={boost}
            setBoost={setBoost}
            setCallTime={setCallTime}
            stopRoll={stopRoll}
            showLiveChart={showLiveChart}
            setShowLiveChart={setShowLiveChart}
          />
        </div>
        {!showLiveChart && (
          <Draggable
            defaultPosition={defaultPosition}
            grid={[25, 25]}
            scale={1}
            onDrag={handleDrag}
          >
            <div className="hidden desktop:block self-start bg-[#24224a] dark:bg-[#291f40] w-full desktop:w-[18rem] rounded-xl z-[50] cursor-pointer">
              <LiveChart
                setShowLiveChart={setShowLiveChart}
                totalProfit={totalProfit}
                setTotalProfit={setTotalProfit}
                totalWins={totalWins}
                setTotalWins={setTotalWins}
                totalWager={totalWager}
                setTotalWager={setTotalWager}
                totalLoss={totalLoss}
                setTotalLoss={setTotalLoss}
                tokenPrice={price}
              />
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}

export default GameInterface;
