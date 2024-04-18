import { Outlet } from "react-router-dom";
import Header from "./Header";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="flex flex-col bg-[#120e1f] w-screen min-h-screen relative">
      <Header />

      <div className="flex gap-10">
        <MobileNavbar />
        <div className="flex-1 mx-auto overflow-hidden flex h-full min-h-[calc(100vh_-_15rem)]">
          <Sidebar />
          <main className="w-full">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;
