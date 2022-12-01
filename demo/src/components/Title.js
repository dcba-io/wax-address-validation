const Title = ({ title }) => {
    return (
        <div className="bg-dark-blue flex justify-center items-center h-16 w-full">
            <h1 className="md:text-2xl text-xl font-light text-white-gray">{title}</h1>
        </div>
    );
}

export default Title;
