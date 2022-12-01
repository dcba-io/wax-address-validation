const InputItem = ({ label, inputType, labelFor, errorMessage }) => {
    return (
        <div className="mb-4">
            <label for={`${labelFor}`} className="form-label inline-block mb-2 text-sm text-dark-gray">{label}</label>
            <input type={`${inputType}`} className="
                block
                w-full
                h-8
                px-3
                py-1.5
                text-sm
                text-dark-gray
                border border-solid border-light-gray
                shadow-xs
                rounded
                m-0"/>
            <span className="text-sm text-red">{errorMessage}</span>
        </div>);
}

export default InputItem;