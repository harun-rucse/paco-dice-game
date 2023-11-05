import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <section className="bg-[#191c1f] text-white flex w-screen h-screen">
      {showSidebar && (
        <div className="w-[14rem] h-full">
          <Sidebar />
        </div>
      )}
      <main className="flex-1 h-[60px]">
        <Header setShowSidebar={setShowSidebar} />
        <div className="p-8 w-full max-w-[1200px] mx-auto h-[calc(100vh-60px)] overflow-y-scroll">
          <Outlet />
        </div>
      </main>
    </section>
  );
}

export default AdminLayout;
