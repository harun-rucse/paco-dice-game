import { useDarkMode } from "../../../context/DarkModeContext";
import Modal from "../../components/Modal";
import Fairness from "../fairness/Fairness";
import Limit from "./Limit";
import Rules from "./Rules";

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
    boost ? setCallTime(500) : setCallTime(350);
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
        <Modal>
          <Modal.Open opens="fairness">
            <img
              src={
                isDarkMode ? "/images/search-dark.png" : "/images/search.png"
              }
              alt=""
              className="w-6 cursor-pointer"
            />
          </Modal.Open>
          <Modal.Body name="fairness">
            <Fairness />
          </Modal.Body>
        </Modal>

        <Modal>
          <Modal.Open opens="rules">
            <img
              src={
                isDarkMode
                  ? "/images/document-dark.png"
                  : "/images/document.png"
              }
              alt=""
              className="w-7 cursor-pointer"
            />
          </Modal.Open>
          <Modal.Body
            name="rules"
            className="rounded-2xl w-[25rem] tablet:min-w-[40rem] h-[38rem] tablet:min-h-[30rem] bg-transparent"
          >
            <Rules />
          </Modal.Body>
        </Modal>

        <Modal>
          <Modal.Open opens="limit">
            <img
              src={isDarkMode ? "/images/scale-dark.png" : "/images/scale.png"}
              alt=""
              className="w-7 cursor-pointer"
            />
          </Modal.Open>
          <Modal.Body
            name="limit"
            className="rounded-2xl w-[22rem] tablet:min-w-[35rem] h-[30rem] tablet:min-h-[36rem] bg-transparent"
          >
            <Limit />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Control;
