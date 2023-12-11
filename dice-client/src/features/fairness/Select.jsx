import Select from "react-select";

function CustomSelect({ options, onChange, placeholder }) {
  return (
    <Select
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
