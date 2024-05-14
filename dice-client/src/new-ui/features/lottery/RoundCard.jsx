import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useDarkMode } from "../../../context/DarkModeContext";

function RoundCard({ round }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const roundParams = Number(searchParams.get("round") || 1);
  const { isDarkMode } = useDarkMode();

  function handleChangeRound(direction) {
    const newRound = direction === "left" ? roundParams - 1 : roundParams + 1;

    searchParams.set("round", newRound);
    searchParams.set("page", 1);

    setSearchParams(searchParams);
  }

  return (
    <div className="text-center space-y-1">
      <span className="text-lg">Round</span>
      <div className="flex items-center gap-1">
        <button
          className="shadow-xl cursor-pointer"
          onClick={() => handleChangeRound("left")}
          disabled={roundParams === 1}
        >
          <FaChevronLeft size={26} color={isDarkMode ? "#9760b1" : "#534f8a"} />
        </button>
        <div className="bg-[#34325c] dark:bg-[#7c4b7d] text-sm md:text-base px-12 py-2 rounded-lg shadow-2xl">
          {`#${roundParams}`}
        </div>
        <button
          className="shadow-xl cursor-pointer"
          onClick={() => handleChangeRound("right")}
          disabled={roundParams === round}
        >
          <FaChevronRight
            size={26}
            color={isDarkMode ? "#9760b1" : "#534f8a"}
          />
        </button>
      </div>
    </div>
  );
}

export default RoundCard;
