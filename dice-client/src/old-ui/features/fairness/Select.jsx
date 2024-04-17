import Select from "react-select";

function CustomSelect({ defaultValue, options, onChange, placeholder }) {
  return (
    <Select
      defaultValue={defaultValue ? defaultValue : null}
      closeMenuOnSelect={true}
      isClearable={true}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
}

export default CustomSelect;
