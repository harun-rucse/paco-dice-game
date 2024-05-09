import { cn } from "../../../utils";

function TopBar({ title, children, className }) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between",
        className
      )}
    >
      <h2 className="text-lg md:text-2xl">{title}</h2>
      {children}
    </div>
  );
}

export default TopBar;
