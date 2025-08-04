import Features from "./Features";
import HeroSection from "./HeroSection";
import HomrPageFooter from "./HomePageFooter";
import Navbar from "./Navbar";

const MainPage = () => {
  return (
    <div className="flex flex-col h-[100vh] w-full justify-between">
      <Navbar />
      <HeroSection />
      <Features />
      {/* <Footer /> */}
      <HomrPageFooter />
    </div>
  );
};

export default MainPage;
