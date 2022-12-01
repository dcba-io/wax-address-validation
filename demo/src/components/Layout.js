import Title from "./Title";

const Layout = ({ children }) => {
  return (
    <div
      className="flex
                flex-col
                bg-white-gray
                mx-auto
                w-screen
                h-full
                md:h-screen"
    >
      <Title title="WAX Address Validation Demo" />
      {children}
    </div>
  );
};

export default Layout;
