import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useDarkMode } from "../../context/DarkModeContext";

function AppLayout() {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`flex flex-col ${
        isDarkMode ? "dark" : "light"
      } w-screen min-h-screen relative`}
    >
      <Header />

      <div className="flex gap-10">
        <MobileNavbar />
        <div className="flex-1 mx-auto overflow-hidden flex h-full min-h-[calc(100vh_-_15rem)]">
          <Sidebar />
          <main className="w-full min-h-screen bg-[#1c1a3e] dark:bg-[#120e1f]">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;
