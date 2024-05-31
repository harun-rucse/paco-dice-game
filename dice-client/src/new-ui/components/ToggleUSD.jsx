import { useState } from "react";

function ToggleUSD({ onSwitch, defaultValue = false }) {
  const [isOn, setIsOn] = useState(defaultValue);

  const toggleSwitch = () => {
    setIsOn((state) => {
      onSwitch(!state);
      return !state;
    });
  };

  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative flex">
        <input
          type="checkbox"
          className="hidden"
          checked={isOn}
          onChange={toggleSwitch}
        />
        <div
          className={`w-20 h-6 tablet:h-7 ${
            isOn
              ? "bg-[#575397] dark:bg-[#523376]"
              : "bg-[#151329] dark:bg-[#281f3f]"
          }  rounded-full shadow-lg`}
        ></div>
        <div
          className={`absolute w-6 tablet:w-7 h-6 tablet:h-7 border-2 rounded-full shadow-md transform transition-transform ${
            isOn
              ? "translate-x-[3.4rem] tablet:translate-x-[3.25rem] bg-[#7874be] border-[#494773]"
              : "translate-x-[2px] bg-[#ffff] border[#eee]"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleUSD;
