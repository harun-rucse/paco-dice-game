function FormRow({ label, name, error, children }) {
  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <label htmlFor={name} className="uppercase text-sm font-extralight">
        {label}
      </label>
      {children}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

export default FormRow;
