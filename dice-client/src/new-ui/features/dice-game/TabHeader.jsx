function TabHeader({ tab, setTab }) {
  return (
    <div className="flex items-center h-[3rem]">
      <button
        className={`w-full h-full ${
          tab === "manual"
            ? "bg-[#433f85] dark:bg-[#7e3e95] border-[#605baa] dark:border-[#a95dab]"
            : "bg-[#2a2759] dark:bg-[#50316d] border-[#4c488a] dark:border-[#9879b6]"
        } border-b-2 focus:outline-none bg-[7a3e91] text-base tablet:text-lg`}
        onClick={() => setTab("manual")}
      >
        Manual
      </button>
      <button
        className={`w-full h-full ${
          tab === "auto"
            ? "bg-[#433f85] dark:bg-[#7e3e95] border-[#605baa] dark:border-[#a95dab]"
            : "bg-[#2a2759] dark:bg-[#50316d] border-[#4c488a] dark:border-[#9879b6]"
        } border-b-2 focus:outline-none bg-[7a3e91] text-base tablet:text-lg`}
        onClick={() => setTab("auto")}
      >
        Auto
      </button>
    </div>
  );
}

export default TabHeader;
