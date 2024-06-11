import { cn } from "../../../utils/index";
import { abbreviateNumber } from "../../../utils/format";

function TextBox({
  amount,
  isCompleted = false,
  icon = "/images/paco.png",
  className,
}) {
  return (
    <div
      className={cn(
        `w-[5.2rem] flex items-center justify-between px-1 tablet:px-3 py-1 ${
          isCompleted ? "bg-[#6c6bb6]" : "bg-[#1d1d3b]"
        } rounded-lg shadow-lg`,
        className
      )}
    >
      <span className="text-xs tablet:text-base">
        {abbreviateNumber(Number(amount))}
      </span>
      <img src={icon} alt="" className="w-4 tablet:w-5" />
    </div>
  );
}

export default TextBox;
