
const InputItem = ({ inputType, label, onChange, labelFor, value }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={labelFor}
        className="form-label inline-block mb-2 text-sm text-dark-gray">
        {label}
      </label>
      <input
        id={labelFor}
        type={inputType}
        value={value}
        onChange={onChange}
        className="block
                  w-full
                  h-8
                  px-3
                  py-1.5
                  text-sm
                  text-dark-gray
                  border
                  border-solid
                  border-light-gray
                  shadow-xs
                  rounded m-0"
      />
    </div>
  );
};

export default InputItem;
