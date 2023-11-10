function Input({ name, label, icon, ...rest }) {
  return (
    <div className="flex flex-col gap-2 text-white">
      <label htmlFor={name} className="uppercase text-sm md:text-base">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type="number"
          placeholder="0"
          className="bg-transparent focus:outline-none text-white text-sm md:text-2xl px-4 py-1 w-full rounded-2xl border border-[#c786f2]"
          {...rest}
        />
        {icon && (
          <span className="absolute top-1 right-4 text-sm md:text-2xl">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

export default Input;
