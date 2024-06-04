import { cn } from "../../../utils";
import { currencyFormat, numberFormat } from "../../../utils/format";

function SingleToken({ icon, title, subTitle, name, className }) {
  return (
    <div
      className={cn(
        "w-full flex gap-3 items-center text-sm tablet:text-lg",
        className
      )}
    >
      <img src={icon} alt="" className="w-8 tablet:w-8 object-contain" />
      <div className="w-full flex flex-col justify-between">
        <p className="flex items-center justify-between text-white">
          <span>
            {numberFormat(
              name === "PACO"
                ? Number(title).toFixed(2)
                : Number(title).toFixed(8)
            )}
          </span>
          <span className="text-[#b4b3b3] pl-3">{name}</span>
        </p>
        <span className="self-start text-sm">{currencyFormat(subTitle)}</span>
      </div>
    </div>
  );
}

export default SingleToken;
