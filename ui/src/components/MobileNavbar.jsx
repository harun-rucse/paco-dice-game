import { AiOutlineHome } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { SiWalletconnect } from "react-icons/si";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiWallet } from "react-icons/ci";
import { NavLink } from "react-router-dom";

function MobileNavbar() {
  return (
    <div className="block md:hidden fixed left-0 bottom-1 w-full z-[9999] ">
      <div className="flex justify-between bg-[#432663] px-6 py-2 m-2 text-white font-bold rounded-3xl shadow-md shadow-[#432663]">
        <NavLink to="/" className="hover:bg-[#423566] px-4 py-2 rounded-md">
          <AiOutlineHome size={26} />
        </NavLink>

        <NavLink
          to="/staking"
          className="hover:bg-[#423566] px-4 py-2 rounded-md"
        >
          <BsCurrencyDollar size={26} />
        </NavLink>

        <NavLink
          to="/trade"
          className="hover:bg-[#423566] px-4 py-2 rounded-md"
        >
          <TfiReload size={25} />
        </NavLink>

        <NavLink to="/" className="hover:bg-[#423566] px-4 py-2 rounded-md">
          <SiWalletconnect size={26} />
        </NavLink>

        <NavLink className="hover:bg-[#423566] px-4 py-2 rounded-md">
          <CiWallet size={26} />
        </NavLink>
      </div>
    </div>
  );
}

export default MobileNavbar;
