import { cn } from "../../../utils";

function InfoCard({ title, subTitle, titleIcon, subTitleIcon, className }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="uppercase md:text-lg text-[#b4b3b3]">{title}</p>
        {titleIcon && <img src={titleIcon} alt="icon" className="w-[1.6rem]" />}
      </div>
      <div className={cn("flex items-center gap-3", className)}>
        {subTitleIcon && (
          <img src={subTitleIcon} alt="" className="w-[1.4rem] md:w-[1.8rem]" />
        )}
        <strong className="font-medium md:text-lg">{subTitle}</strong>
      </div>
    </div>
  );
}

export default InfoCard;
