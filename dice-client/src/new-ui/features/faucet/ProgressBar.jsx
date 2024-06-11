function ProgressBar({ progressWidth }) {
  return (
    <div className="bg-[#1f1e47] dark:bg-[#36254c] rounded-xl h-8 w-full flex items-center justify-start p-2 shadow-[inset_0px_4px_10px_0px_rgba(0,0,0,0.5)]">
      <div
        className="bg-[#365ada] dark:bg-[#7d36da] rounded-2xl border border-[#6b92f9] dark:border-[#a967ff] h-6 min-w-[1.5rem] relative"
        style={{
          width: `${progressWidth}%`,
        }}
      >
        <span className="bg-white/20 shadow-[2px_0px_5px_2px_rgba(128,147,244,0.75)] w-6 h-6 rounded-full absolute top-0 right-0"></span>
      </div>
    </div>
  );
}

export default ProgressBar;
