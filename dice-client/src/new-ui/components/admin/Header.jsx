import { useQueryClient } from "@tanstack/react-query";
import { FiLogOut } from "react-icons/fi";
import { HiBars3 } from "react-icons/hi2";
import { useLogout } from "../../features/authentication/useLogout";

function Header({ setShowSidebar }) {
  const queryClient = useQueryClient();
  const { logout } = useLogout();

  function handleLogout() {
    logout();
    queryClient.removeQueries();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  return (
    <div className="bg-[#2d3235] px-6 py-3 flex items-center justify-between gap-5">
      <div onClick={() => setShowSidebar((show) => !show)}>
        <HiBars3 size={26} className="cursor-pointer" />
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <img src="/icons/bell.png" alt="" className="w-7" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-extralight w-3 h-3 rounded-full flex justify-center items-center p-2">
            3
          </span>
        </div>
        <img src="/icons/profile.png" alt="" className="w-9" />
        <strong className="uppercase">Admin</strong>
        <span onClick={handleLogout}>
          <FiLogOut size={20} className="cursor-pointer" />
        </span>
      </div>
    </div>
  );
}

export default Header;
