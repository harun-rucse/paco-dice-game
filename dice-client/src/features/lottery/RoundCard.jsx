import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { padNumber } from "../../utils/format";
import useGetLastRound from "./useGetLastRound";
import LoadingSpinner from "../../components/LoadingSpinner";

function RoundCard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParams = Number(searchParams.get("round") || 1);
  const { isLoading, round } = useGetLastRound();

  useEffect(() => {
    if (round) {
      searchParams.set("round", round);
      setSearchParams(searchParams);
    }
  }, [round]);

  function handleChangeRound(direction) {
    const newRound = direction === "left" ? roundParams - 1 : roundParams + 1;

    searchParams.set("round", newRound);
    searchParams.set("page", 1);

    setSearchParams(searchParams);
  }

  if (isLoading) return <LoadingSpinner className="h-[4rem]" />;

  return (
    <div className="text-center space-y-1">
      <span className="text-lg">Round</span>
      <div className="flex items-center gap-1">
        <button
          className="shadow-xl cursor-pointer"
          onClick={() => handleChangeRound("left")}
          disabled={roundParams === 1}
        >
          <FaChevronLeft size={26} color="#9760b1" />
        </button>
        <div className="bg-[#7c4b7d] text-sm md:text-base px-4 py-2 rounded-lg shadow-lg">
          {padNumber(roundParams, 8)}
        </div>
        <button
          className="shadow-xl cursor-pointer"
          onClick={() => handleChangeRound("right")}
          disabled={roundParams === round}
        >
          <FaChevronRight size={26} color="#9760b1" />
        </button>
      </div>
    </div>
  );
}

export default RoundCard;
