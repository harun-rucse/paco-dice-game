import toast from "react-hot-toast";
import { MdOutlineContentCopy } from "react-icons/md";

function InputBox({ label, name, value, ...rest }) {
  function handleCopy() {
    navigator.clipboard.writeText(value);
    toast.success("Text coppied successful");
  }

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm md:text-lg font-semibold">
        {label}
      </label>
      <div className="flex items-center justify-between gap-2 bg-[#1e132d] border border-[#A856E9] px-3 md:px-4 rounded-xl">
        <input
          id={name}
          className="w-full bg-transparent focus:outline-none py-3 md:py-4 text-sm md:text-base"
          value={value}
          {...rest}
        />
        <div
          className="bg-[#432c5f] w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={handleCopy}
        >
          <MdOutlineContentCopy color="#ffff" className="md:text-xl" />
        </div>
      </div>
    </div>
  );
}

export default InputBox;
