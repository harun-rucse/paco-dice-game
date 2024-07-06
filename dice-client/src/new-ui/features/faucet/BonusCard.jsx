import TextBox from "./TextBox";
import SliderBox from "./SliderBox";
import LoadingSpinner from "../../components/LoadingSpinner";
import useGetReward from "./useGetReward";
import { useClaimFaucetReward } from "./useClaimFaucetReward";

function BonusCard() {
  const { isLoading, currentReward, progressWidth, secondsElapsed, rewards } =
    useGetReward();

  const { claim } = useClaimFaucetReward();

  const handleClaim = () => {
    claim(currentReward);
  };

  return (
    <div className="bg-[#24224a] dark:bg-[#594a80] w-full flex flex-col border border-[#3d3b72] dark:border-[#917ec2] rounded-2xl tablet:px-8 py-3 pb-9">
      {isLoading ? (
        <LoadingSpinner className="h-[18.5rem]" />
      ) : (
        <>
          <div className="flex items-center justify-between px-2 tablet:px-0">
            <div className="flex items-center gap-2">
              <img src="/images/paco.png" alt="" className="w-6 tablet:w-12" />
              <h2 className="uppercase text-sm tablet:text-xl">Paco Bonus</h2>
            </div>

            <div className="flex items-center gap-1 tablet:gap-4">
              <h3 className="uppercase hidden tablet:block">
                Available to claim:
              </h3>
              <h3 className="uppercase block text-sm tablet:hidden">
                Available:
              </h3>
              <TextBox amount={currentReward} />
            </div>
          </div>

          <div className="px-2 py-6">
            <div className="flex items-center justify-between max-w-[16rem] laptop:max-w-[24rem] mx-auto">
              <TextBox
                amount={1}
                icon={
                  currentReward == "125" ||
                  currentReward == "500" ||
                  currentReward == "2000"
                    ? "/images/faucet/standard-color.png"
                    : "/images/faucet/standard-gray.png"
                }
                className={`mb-2 px-2 ${
                  currentReward == "125" ||
                  currentReward == "500" ||
                  currentReward == "2000"
                    ? "shadow-[1px_1px_20px_5px_rgba(60,152,58,0.6)]"
                    : "shadow-lg"
                }`}
                // className="mb-2 px-2 shadow-lg"
                isCompleted={
                  currentReward == "125" ||
                  currentReward == "500" ||
                  currentReward == "2000"
                }
                isHighlight={
                  currentReward == "125" ||
                  currentReward == "500" ||
                  currentReward == "2000"
                }
              />

              <div
                className={`w-[6rem] flex items-center justify-between px-3 py-1 rounded-xl ${
                  currentReward == "500" || currentReward == "2000"
                    ? "shadow-[1px_1px_20px_5px_rgba(60,152,58,0.6)] bg-[#6c6bb6] dark:bg-[#9c73c1]"
                    : "bg-[#1d1d3b] dark:bg-[#342546] shadow-lg"
                } mb-2`}
              >
                <img
                  src={
                    currentReward == "500" || currentReward == "2000"
                      ? "/images/faucet/standard-color.png"
                      : "/images/faucet/standard-gray.png"
                  }
                  alt=""
                  className={`w-6 ${
                    (currentReward == "500" || currentReward == "2000") &&
                    "animate-bounce"
                  }`}
                />
                <span>+</span>
                <img
                  src={
                    currentReward == "500" || currentReward == "2000"
                      ? "/images/faucet/mega-color.png"
                      : "/images/faucet/mega-gray.png"
                  }
                  alt=""
                  className={`w-6 ${
                    (currentReward == "500" || currentReward == "2000") &&
                    "animate-bounce"
                  }`}
                />
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
            disabled={currentReward == 0}
          >
            Claim
          </button>
        </>
      )}
    </div>
  );
}

export default BonusCard;
