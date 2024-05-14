import { useDarkMode } from "../../../context/DarkModeContext";

function Control({
  playAudio,
  setPlayAudio,
  boost,
  setBoost,
  setCallTime,
  stopRoll,
  showLiveChart,
  setShowLiveChart,
}) {
  const { isDarkMode } = useDarkMode();

  function handleBoost() {
    boost ? setCallTime(800) : setCallTime(200);
    setBoost((prev) => !prev);
  }

  return (
    <div className="flex justify-between items-center bg-[#24224a] dark:bg-[#291f40] px-6 py-4 rounded-b-xl">
      <div className="flex items-center gap-6 tablet:gap-8">
        <img
          src={isDarkMode ? "/images/volume-dark.png" : "/images/volume.png"}
          alt=""
          className={`w-7 cursor-pointer ${
            playAudio
              ? "grayscale-0 brightness-100"
              : "grayscale-[60%] brightness-75 dark:brightness-50"
          }`}
          onClick={() => setPlayAudio(!playAudio)}
        />
        <img
          src="/images/boost.png"
          alt=""
          className={`w-4 cursor-pointer ${
            boost
              ? "grayscale-0 brightness-100"
              : "grayscale-[60%] brightness-75 dark:brightness-50"
          }`}
          onClick={handleBoost}
        />
        <img
          src={isDarkMode ? "/images/stock-dark.png" : "/images/stock.png"}
          alt=""
          className={`w-7 cursor-pointer ${
            !showLiveChart
              ? "grayscale-0 brightness-100"
              : "grayscale-[60%] brightness-75 dark:brightness-50"
          }`}
          onClick={() => setShowLiveChart((state) => !state)}
        />
      </div>
      <div className="flex items-center gap-8">
        <img
          src={isDarkMode ? "/images/search-dark.png" : "/images/search.png"}
          alt=""
          className="w-6"
        />
        <img
          src={
            isDarkMode ? "/images/document-dark.png" : "/images/document.png"
          }
          alt=""
          className="w-7"
        />
        <img
          src={isDarkMode ? "/images/scale-dark.png" : "/images/scale.png"}
          alt=""
          className="w-7"
        />
      </div>
    </div>
  );
}

export default Control;
