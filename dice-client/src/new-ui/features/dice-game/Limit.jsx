import { useDarkMode } from "../../../context/DarkModeContext";

function Limit() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="w-full h-full">
      <img
        src={
          isDarkMode
            ? "/images/limits/limit-dark.png"
            : "/images/limits/limit.png"
        }
        className="object-contain w-full h-full"
      />
    </div>
  );
}

export default Limit;
