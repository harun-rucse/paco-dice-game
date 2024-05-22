import { useEffect, useState } from "react";
import useGamesHistory from "../dice-game/useGamesHistory";
import InputBox from "./InputBox";
import CustomSelect from "./Select";

const SERVER_SEED = import.meta.env.VITE_SERVER_SEED;

const dateFormat = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};

function Fairness() {
  const [randomSeed, setRandomSeed] = useState("");
  const [hashRound, setHashRound] = useState("");
  const [roundHistories, setRoundHistories] = useState([]);

  const { isLoading, games } = useGamesHistory();

  useEffect(() => {
    if (!isLoading && games?.length > 0) {
      const { randomSeed, hashRound } = games[0];
      setRandomSeed(randomSeed);
      setHashRound(hashRound);
      setRoundHistories(games);
    }
  }, [games, isLoading]);

  function handleRoundChange(option) {
    setRandomSeed(option.randomSeed);
    setHashRound(option.hashRound);
  }

  return (
    <div className="w-full bg-gradient-to-b from-[#39366f] dark:from-[#42375f] via-[#24224a] dark:via-[#1e182d] to-[#24224a] dark:to-[#1d172c] h-full md:min-h-[36rem] rounded-2xl">
      <div className="flex flex-col text-white px-4 md:px-10 py-6 space-y-4 md:space-y-6 font-['Poppins']">
        <div className="space-y-3">
          <h4 className="uppercase text-xl md:text-2xl font-bold">Fairness</h4>
          <p className="text-xs md:text-base">
            A provably fair system based on the SHA256 algorithm and includes a
            random number = a combination of a random winning number and the
            initial number of the server. Each round has its own hash,
            consisting of random wins that are uniquely generated for each bet.
          </p>
        </div>

        <InputBox
          type="string"
          name="server-seed"
          label="Server Seed"
          value={SERVER_SEED}
          onChange={() => {}}
          readOnly
        />

        <div className="space-y-4 md:space-y-6 md:pt-4">
          <h4 className="md:text-xl font-semibold">Previous rounds history</h4>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <CustomSelect
              defaultValue={{ value: "dice", label: "Dice" }}
              options={[{ value: "dice", label: "Dice" }] ?? []}
              placeholder="Select game"
              onChange={() => {}}
            />

            <CustomSelect
              options={
                roundHistories?.map((round) => ({
                  value: round?._id,
                  randomSeed: round?.randomSeed,
                  hashRound: round?.hashRound,
                  label: dateFormat(round?.createdAt),
                })) ?? []
              }
              placeholder="Select round"
              onChange={handleRoundChange}
            />
          </div>
        </div>

        <InputBox
          type="string"
          name="random-seed"
          label="Random Seed"
          value={randomSeed}
          onChange={() => {}}
          readOnly
        />

        <InputBox
          type="string"
          name="hash-round"
          label="Hash round"
          value={hashRound}
          onChange={() => {}}
          readOnly
        />

        <a
          href="https://www.movable-type.co.uk/scripts/sha256.html"
          target="_blank"
          className="self-center bg-[#34a446] border-b-[6px] border-[#214F30] px-12 py-3 rounded-lg font-semibold"
          rel="noreferrer"
        >
          Check
        </a>
      </div>
    </div>
  );
}

export default Fairness;
