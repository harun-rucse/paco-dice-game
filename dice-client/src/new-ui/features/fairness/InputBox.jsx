import toast from "react-hot-toast";
import { IoClipboard } from "react-icons/io5";

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
      <div className="flex items-center justify-between gap-2 bg-[#1d1b3d] dark:bg-[#1e132d] border border-[#333062] dark:border-[#4c498b] px-3 md:px-4 rounded-xl">
        <input
          id={name}
          className="w-full bg-transparent focus:outline-none py-3 md:py-4 text-sm md:text-base"
          value={value}
          {...rest}
        />
        <div
          className="bg-[#2e2c54] w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-lg cursor-pointer"
          onClick={handleCopy}
        >
          <IoClipboard color="#ffff" className="md:text-xl" />
        </div>
      </div>
    </div>
  );
}

export default InputBox;
