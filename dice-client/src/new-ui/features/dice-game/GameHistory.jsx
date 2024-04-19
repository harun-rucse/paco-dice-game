import { useEffect, useRef } from "react";

function GameHistory({ histories, isLoading }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({
        left: ref.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [histories]);

  return (
    <div
      className="flex items-center gap-2 h-16 bg-[#332542] border-2 border-[#241b30] shadow-md rounded-xl shadow-[#2a1b5c] px-4 py-3 w-full overflow-y-hidden overflow-x-auto"
      ref={ref}
    >
      {histories &&
        histories.map((game, i) => (
          <span
            key={i}
            className={`flex-shrink-0 bg-[#281f3e] text-3xl ${
              game.status === "win" ? "text-[#5fcf4b]" : "text-[#be1e1e]"
            } px-6 py-0 rounded-lg shadow-lg border border-[#211b30]`}
          >
            {game.winNumber}
          </span>
        ))}

      {isLoading && (
        <p className="text-white text-center w-full">Loading histories....</p>
      )}
    </div>
  );
}

export default GameHistory;
