import { useState } from "react";

function ToggleDarkMode({ onSwitch }) {
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
        <div className="w-20 h-9 bg-[#372f4b] rounded-full shadow-lg"></div>
        <div
          className={`absolute top-[2px] w-8 h-8 bg-[#864c9b] border-2 border-[#190c22] rounded-full shadow-md transform transition-transform ${
            isOn ? "translate-x-11" : "translate-x-1"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default ToggleDarkMode;
