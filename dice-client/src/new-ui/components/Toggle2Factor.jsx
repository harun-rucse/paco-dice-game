import { useState } from "react";

function Toggle2Factor({ onSwitch }) {
  const [isOn, setIsOn] = useState(false);

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
              ? "bg-[#27c152] dark:bg-[#55ad69]"
              : "bg-[#151329] dark:bg-[#281f3f]"
          }  rounded-full shadow-lg`}
        ></div>
        <div
          className={`absolute top-[2px] w-6 tablet:w-6 h-5 tablet:h-6 bg-[#ffff] border-2 border[#eee] rounded-full shadow-md transform transition-transform ${
            isOn
              ? "translate-x-[3.3rem] tablet:translate-x-[3.25rem]"
              : "translate-x-1"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default Toggle2Factor;
