import { useState } from "react";

function Switch() {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(!isOn);
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
          className={`w-12 h-5 ${
            isOn ? "bg-green-400" : "bg-gray-400"
          } rounded-full shadow-inner`}
        ></div>
        <div
          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            isOn ? "translate-x-7" : ""
          }`}
        ></div>
      </div>
    </label>
  );
}

export default Switch;
