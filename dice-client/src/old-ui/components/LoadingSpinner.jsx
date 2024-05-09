import { ImSpinner3 } from "react-icons/im";
import { cn } from "../../utils/index";

function LoadingSpinner({ className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 h-[20rem]",
        className
      )}
    >
      <ImSpinner3 className="animate-spin text-4xl text-white" />
      <span className="text-xl text-white">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
