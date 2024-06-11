import { useState, useEffect } from "react";
import TextBox from "./TextBox";
import SliderBox from "./SliderBox";

const rewards = [
  { time: 2, coins: 250, progress: 15 },
  { time: 4, coins: 500, progress: 37 },
  { time: 8, coins: 1000, progress: 58 },
  { time: 16, coins: 2000, progress: 80 },
  { time: 32, coins: 4000, progress: 100 },
];

function LevelCard() {
  const [levelTimes, setLevelTimes] = useState(() => {
    const savedTime = localStorage.getItem("levelTimes");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [gambleCoins, setGambleCoins] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

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

    const _progressWidth = calculateProgressWidth(levelTimes);
    setProgressWidth(_progressWidth);
  }, [levelTimes]);

  const handleGamble = () => {
    if (levelTimes > rewards[rewards.length - 1].time) {
      localStorage.setItem("levelTimes", 0);
      setLevelTimes(0);
    }

    setLevelTimes((prev) => {
      const newLevelTimes = prev === 0 ? 2 : prev * 2;
      localStorage.setItem("levelTimes", newLevelTimes);
      return newLevelTimes;
    });
  };

  const handleCollect = () => {
    const reward = getReward(levelTimes);
    setGambleCoins(gambleCoins + reward);
    setProgressWidth(0);
    localStorage.setItem("levelTimes", 0);
    setLevelTimes(0);
  };

  const getReward = (elapsed) => {
    for (let i = 0; i <= rewards.length - 1; i++) {
      if (elapsed === rewards[i].time) {
        return rewards[i].coins;
      }
    }
    return 0;
  };

  const currentReward = getReward(levelTimes);

  return (
    <div className="bg-[#24224a] flex flex-col gap-4 border border-[#3d3b72] rounded-2xl px-4 py-3 pb-6">
      <div className="flex justify-between gap-20">
        <div className="flex flex-col gap-8">
          <span>Level 1</span>
          <div className="bg-[#1c1b37] w-28 h-28 rounded-full flex items-center justify-center">
            <img src="/images/faucet/lost.png" alt="" className="w-24" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col items-center gap-2">
            <h3 className="uppercase">Available to gamble:</h3>
            <TextBox amount={currentReward} className="w-full py-2" />
          </div>

          <button className="button !bg-[#d11f1f] !py-2" onClick={handleGamble}>
            Gamble
          </button>
          <button
            className="button !bg-[#3c983a] !py-2"
            onClick={handleCollect}
          >
            Collect
          </button>
        </div>
      </div>

      <div>
        <SliderBox
          progressWidth={progressWidth}
          rewards={rewards}
          secondsElapsed={levelTimes}
          isLevelCard
        />
      </div>
    </div>
  );
}

export default LevelCard;
