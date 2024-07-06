import { useState, useEffect } from "react";
import TextBox from "./TextBox";
import SliderBox from "./SliderBox";
import useGetReward from "./useGetReward";
import { useGamble } from "./useGamble";
import { useCollectReward } from "./useCollectReward";

function prepareRewards(value, level = 1) {
  const rewards = [
    { time: 2 * level, coins: value * 2 * level, progress: 15 },
    { time: 4 * level, coins: value * 4 * level, progress: 37 },
    { time: 8 * level, coins: value * 8 * level, progress: 58 },
    { time: 16 * level, coins: value * 16 * level, progress: 80 },
    { time: 32 * level, coins: value * 32 * level, progress: 100 },
  ];

  return rewards;
}

function getLevelNumber(lastMultiplier) {
  if (lastMultiplier > 32 && lastMultiplier <= 1024) {
    return 32;
  } else if (lastMultiplier > 1024 && lastMultiplier <= 32768) {
    return 1024;
  } else if (lastMultiplier > 32768 && lastMultiplier <= 1048576) {
    return 32768;
  }
}

function LevelCard() {
  const [progressWidth, setProgressWidth] = useState(0);
  const [winwinAnimate, setWinwinAnimate] = useState(false);
  const [winloseAnimate, setWinloseAnimate] = useState(false);
  const [isCollectClick, setIsCollectClick] = useState(false);

  const {
    currentReward: faucetReward,
    lastMultiplier,
    initialGambleAmount,
    availableGambleAmount,
  } = useGetReward();

  const { collect } = useCollectReward();

  const rewards = prepareRewards(
    parseFloat(initialGambleAmount) > 0 ? initialGambleAmount : faucetReward,
    getLevelNumber(lastMultiplier)
  );

  const { gamble, data } = useGamble();

  useEffect(() => {
    const calculateProgressWidth = (elapsed) => {
      for (let i = 1; i < rewards.length; i++) {
        if (elapsed < rewards[i].time) {
          const prev = rewards[i - 1];
          const current = rewards[i];
          const progressRange = current.progress - prev.progress;
          const timeRange = current.time - prev.time;
          const progress =
            prev.progress + ((elapsed - prev.time) / timeRange) * progressRange;
          return progress;
        }
      }
      return 100;
    };

    const _progressWidth = calculateProgressWidth(lastMultiplier);
    setProgressWidth(_progressWidth);
  }, [lastMultiplier, rewards]);

  useEffect(() => {
    let timeoutId;
    if (data) {
      data.status === "won" ? setWinwinAnimate(true) : setWinloseAnimate(true);

      timeoutId = setTimeout(() => {
        setWinwinAnimate(false);
        setWinloseAnimate(false);
      }, 1200);
    }

    return () => clearTimeout(timeoutId);
  }, [data]);

  const handleGamble = () => {
    gamble(
      parseFloat(availableGambleAmount) > 0
        ? availableGambleAmount
        : faucetReward
    );
    setIsCollectClick(false);
  };

  const handleCollect = () => {
    collect();
    setIsCollectClick(true);
  };

  const level =
    getLevelNumber(lastMultiplier) === 32
      ? 2
      : getLevelNumber(lastMultiplier) === 1024
      ? 3
      : getLevelNumber(lastMultiplier) === 32768
      ? 4
      : 1;

  return (
    <div className="bg-[#24224a] dark:bg-[#594a80] flex flex-col gap-4 border border-[#3d3b72] dark:border-[#917ec2] rounded-2xl px-4 py-3 pb-6">
      <div className="flex justify-between gap-20 laptop:gap-5 desktop:gap-20">
        <div className="flex flex-col gap-8">
          <span>Level {level}</span>
          <div className="bg-[#1c1b37] w-28 h-28 rounded-full flex items-center justify-center">
            <img
              src={
                winwinAnimate
                  ? "/images/animation/winwin.gif"
                  : winloseAnimate
                  ? "/images/animation/winlose.gif"
                  : data && data.status === "lost"
                  ? "/images/faucet/lost.png"
                  : "/images/faucet/win.png"
              }
              alt=""
              className="w-24"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col items-center gap-2">
            <h3 className="uppercase text-sm">Available to gamble:</h3>
            <TextBox
              amount={
                parseFloat(availableGambleAmount) > 0
                  ? availableGambleAmount
                  : faucetReward
              }
              className="w-full py-2"
            />
          </div>

          <button
            className={`button ${
              lastMultiplier == 1048576 ? "!bg-[#696969]" : "!bg-[#d11f1f]"
            }  !py-2 uppercase`}
            onClick={handleGamble}
            disabled={faucetReward == 0 && availableGambleAmount == 0}
          >
            Gamble
          </button>
          <button
            className={`button ${
              data?.status === "won" && !isCollectClick
                ? "!bg-[#3c983a]"
                : "!bg-[#696969]"
            } !py-2 uppercase`}
            onClick={handleCollect}
            disabled={availableGambleAmount == 0}
          >
            Collect
          </button>
        </div>
      </div>

      <div className="pt-2">
        <SliderBox
          progressWidth={progressWidth}
          rewards={rewards}
          secondsElapsed={lastMultiplier}
          lastMultiplier={lastMultiplier}
          isLevelCard
        />
      </div>
    </div>
  );
}

export default LevelCard;
