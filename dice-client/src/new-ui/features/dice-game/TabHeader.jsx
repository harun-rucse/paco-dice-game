function TabHeader({ tab, setTab }) {
  return (
    <div className="flex items-center h-[3rem]">
      <button
        className={`w-full h-full ${
          tab === "manual"
            ? "bg-[#7e3e95] border-[#a95dab]"
            : "bg-[#50316d] border-[#9879b6]"
        } border-b-2 focus:outline-none bg-[7a3e91] text-base tablet:text-lg`}
        onClick={() => setTab("manual")}
      >
        Manual
      </button>
      <button
        className={`w-full h-full ${
          tab === "auto"
            ? "bg-[#7e3e95] border-[#a95dab]"
            : "bg-[#50316d] border-[#9879b6]"
        } border-b-2 focus:outline-none bg-[7a3e91] text-base tablet:text-lg`}
        onClick={() => setTab("auto")}
      >
        Auto
      </button>
    </div>
  );
}

export default TabHeader;
