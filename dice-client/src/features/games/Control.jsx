import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Fairness from "../fairness/Fairness";

function Control({ playAudio, setPlayAudio, setCallTime, stopRoll }) {
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    if (stopRoll) return;

    if (boost) {
      setCallTime(2000);
    } else {
      setCallTime(2000);
    }
  }, [boost]);

  return (
    <div className="bg-[#592a8a] shadow-[0px_4px_4px_0px_#00000040] flex md:flex-col justify-center md:justify-center md:absolute md:top-[16rem] 2xl:top-[20rem] right-2 2xl:right-[2rem] space-x-6 md:space-x-0 md:space-y-3 rounded-3xl px-2 py-1 md:py-4">
      <Modal>
        <Modal.Open opens="wallet">
          <button className="text-white self-center bg-[#3d1371] p-2 rounded-full cursor-pointer">
            Fair
          </button>
        </Modal.Open>
        <Modal.Body name="wallet">
          <Fairness />
        </Modal.Body>
      </Modal>

      <img
        src="/icons/volume.png"
        alt=""
        className={`w-10 md:w-12 cursor-pointer transition hover:scale-110 ${
          playAudio
            ? "grayscale-0 brightness-100"
            : "grayscale-[40%] brightness-75"
        }`}
        onClick={() => setPlayAudio(!playAudio)}
      />
      <img
        src="/icons/rocket.png"
        alt=""
        className={`w-10 md:w-12  transition hover:scale-110 cursor-not-allowed ${
          !boost
            ? "grayscale-[40%] brightness-75"
            : "grayscale-0 brightness-100"
        } `}
        onClick={() => {}}
      />
      <img
        src="/icons/help.png"
        alt=""
        className="w-10 md:w-12 cursor-pointer transition hover:scale-110"
      />
    </div>
  );
}

export default Control;
