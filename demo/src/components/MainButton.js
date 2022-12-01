const MainButton = ({ label }) => {
    return (
        <button type="submit" className="
            w-2/6
            py-2.5
             bg-dark-blue
             text-white-gray
            font-medium
            float-right
            text-xs
            leading-tight
            rounded
            shadow-md
             hover:bg-dark-gray hover:shadow-lg
             focus:bg-dark-gray focus:shadow-lg focus:outline-none focus:ring-0
             active:bg-dark-gray active:shadow-lg
            transition
            duration-150
            ease-in-out">{label}
        </button>
    );
}

export default MainButton;