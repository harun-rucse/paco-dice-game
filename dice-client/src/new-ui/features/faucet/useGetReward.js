import { useEffect, useState } from "react";
import useGetMyFaucet from "./useGetMyFaucet";

const rewards = [
  { time: 5 * 60, coins: 5, progress: 6 }, // 5 minutes
  { time: 30 * 60, coins: 50, progress: 20 }, // 30 minutes
  { time: 60 * 60, coins: 125, progress: 35 }, // 1 hour
  { time: 3 * 60 * 60, coins: 250, progress: 50 }, // 3 hours
  { time: 6 * 60 * 60, coins: 500, progress: 66 }, // 6 hours
  { time: 12 * 60 * 60, coins: 1000, progress: 81 }, // 12 hours
  { time: 24 * 60 * 60, coins: 2000, progress: 100 }, // 24 hours
];

function useGetReward() {
  const [secondsElapsed, setSecondsElapsed] = useState(null);
  const [lastMultiplier, setLastMultiplier] = useState("1");
  const [availableGambleAmount, setAvailableGambleAmount] = useState("1");
  const [initialGambleAmount, setInitialGambleAmount] = useState("1");
  const { isLoading, data } = useGetMyFaucet();

  useEffect(() => {
    if (data) {
      const lastDate = new Date(data.lastClaimedDate);
      const now = new Date();

      const differenceInMilliSecond = now - lastDate;
      const differenceInSeconds = Math.floor(differenceInMilliSecond / 1000);

      setSecondsElapsed(differenceInSeconds);
      setLastMultiplier(data.lastMultiplier);
      setAvailableGambleAmount(data.availableGambleAmount);
      setInitialGambleAmount(data.initialGambleAmount);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => {
        const newElapsed = prev + 1;
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  return {
    secondsElapsed,
    isLoading,
    currentReward,
    progressWidth,
    rewards,
    lastMultiplier,
    availableGambleAmount,
    initialGambleAmount,
  };
}

export default useGetReward;
