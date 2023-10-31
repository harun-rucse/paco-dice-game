import { useQueryClient } from "@tanstack/react-query";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const queryClient = useQueryClient();

  function handleLogout() {
    localStorage.removeItem("jwt-token");
    queryClient.removeQueries();
    window.location.reload();
  }

  return (
    <div className="bg-[#2d3235] px-6 py-3 flex items-center justify-end gap-5">
      <div className="relative">
        <img src="/icons/bell.png" alt="" className="w-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-3 h-3 rounded-full flex justify-center items-center p-2">
          3
        </span>
      </div>
      <img src="/icons/profile.png" alt="" className="w-9" />
      <strong className="uppercase">Admin</strong>
      <span onClick={handleLogout}>
        <FiLogOut size={20} className="cursor-pointer" />
      </span>
    </div>
  );
}

export default Header;
