function Control({ playAudio, setPlayAudio, setCallTime, stopRoll }) {
  return (
    <div className="flex justify-between items-center bg-[#291f40] px-6 py-4 rounded-b-xl">
      <div className="flex items-center gap-8">
        <img
          src="/images/volume.png"
          alt=""
          className={`w-7 cursor-pointer ${
            playAudio
              ? "grayscale-0 brightness-100"
              : "grayscale-[60%] brightness-50"
          }`}
          onClick={() => setPlayAudio(!playAudio)}
        />
        <img src="/images/boost.png" alt="" className="w-4" />
        <img src="/images/stock.png" alt="" className="w-7" />
      </div>
      <div className="flex items-center gap-6">
        <img src="/images/document.png" alt="" className="w-7" />
        <img src="/images/scale.png" alt="" className="w-7" />
      </div>
    </div>
  );
}

export default Control;
