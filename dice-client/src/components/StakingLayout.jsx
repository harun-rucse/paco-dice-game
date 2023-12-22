import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";

function StakingLayout() {
  return (
    <div className="flex flex-col bg-[#3E1444] w-screen min-h-screen relative">
      <Header />

      <div className="flex gap-10 lg:px-8 py-6">
        <MobileNavbar />
        <div className="flex-1 max-w-[1600px] mx-auto px-4 overflow-hidden">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StakingLayout;
