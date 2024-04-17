import { useState } from "react";

function Switch({ onSwitch }) {
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
          className={`w-16 h-6 ${
            isOn ? "bg-green-400" : "bg-gray-400"
          } rounded-full border border-green-200 shadow-inner`}
        ></div>
        <div
          className={`absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            isOn ? "translate-x-10" : "translate-x-1"
          }`}
        ></div>
      </div>
    </label>
  );
}

export default Switch;
