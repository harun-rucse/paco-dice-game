import { useState, useEffect } from "react";
import TextBox from "./TextBox";
import SliderBox from "./SliderBox";

const rewards = [
  { time: 5 * 60, coins: 5, progress: 6 }, // 5 minutes
  { time: 30 * 60, coins: 50, progress: 20 }, // 30 minutes
  { time: 60 * 60, coins: 125, progress: 35 }, // 1 hour
  { time: 3 * 60 * 60, coins: 250, progress: 50 }, // 3 hours
  { time: 6 * 60 * 60, coins: 500, progress: 66 }, // 6 hours
  { time: 12 * 60 * 60, coins: 1000, progress: 81 }, // 12 hours
  { time: 24 * 60 * 60, coins: 2000, progress: 100 }, // 24 hours
];

function BonusCard() {
  const [secondsElapsed, setSecondsElapsed] = useState(() => {
    const savedTime = localStorage.getItem("secondsElapsed");
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const newElapsed = prev + 1;
        localStorage.setItem("secondsElapsed", newElapsed);
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    const reward = getReward(secondsElapsed);
    setUserCoins(userCoins + reward);
    setSecondsElapsed(0);
  };

  const getReward = (elapsed) => {
    for (let i = rewards.length - 1; i >= 0; i--) {
      if (elapsed >= rewards[i].time) {
        return rewards[i].coins;
      }
    }
    return 0;
  };

  const currentReward = getReward(secondsElapsed);

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

  const progressWidth = calculateProgressWidth(secondsElapsed);

  return (
    <div className="bg-[#24224a] dark:bg-[#594a80] w-full flex flex-col border border-[#3d3b72] dark:border-[#917ec2] rounded-2xl tablet:px-8 py-3 pb-9">
      <div className="flex items-center justify-between px-2 tablet:px-0">
        <div className="flex items-center gap-2">
          <img src="/images/paco.png" alt="" className="w-6 tablet:w-12" />
          <h2 className="uppercase text-sm tablet:text-xl">Paco Bonus</h2>
        </div>

        <div className="flex items-center gap-1 tablet:gap-4">
          <h3 className="uppercase hidden tablet:block">Available to claim:</h3>
          <h3 className="uppercase block text-sm tablet:hidden">Available:</h3>
          <TextBox amount={currentReward} />
        </div>
      </div>

      <div className="px-2 py-6">
        <div className="flex items-center justify-between max-w-[16rem] laptop:max-w-[24rem] mx-auto">
          <TextBox
            amount={5}
            icon="/images/ticket.png"
            className="mb-2 px-2"
            isCompleted
          />

          <div className="bg-[#1d1d3b] w-[6rem] flex items-center justify-between px-3 py-1 rounded-xl shadow-lg mb-2">
            <img src="/images/ticket.png" alt="" className="w-6" />
            <span>+</span>
            <img src="/images/ticket.png" alt="" className="w-6" />
          </div>
        </div>

        <SliderBox
          rewards={rewards}
          secondsElapsed={secondsElapsed}
          progressWidth={progressWidth}
        />
      </div>

      <button
        className="self-center bg-[#3c983a] uppercase text-lg px-10 py-2 rounded-md shadow-[2px_0px_5px_2px_rgba(21,20,43,0.75)]"
        onClick={handleClaim}
      >
        Claim
      </button>
    </div>
  );
}

export default BonusCard;
