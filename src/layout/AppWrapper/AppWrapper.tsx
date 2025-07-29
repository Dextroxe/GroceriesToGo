import { CookiesProvider } from "react-cookie";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center  transition-colors duration-300
      md:px-10 lg:px-20 xl:px-36 2xl:px-44"
    >
      <CookiesProvider>{children}</CookiesProvider>
    </div>
  );
};

export default AppWrapper;
