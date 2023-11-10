import { AiOutlineHome } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiWallet } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import Transaction from "../features/transactions/Transaction";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

function MobileNavbar() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="block md:hidden fixed left-0 bottom-1 w-full z-[999999999] ">
      <div className="flex justify-between bg-[#432663] px-6 py-2 m-2 text-white font-extralight rounded-3xl shadow-md shadow-[#432663]">
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

        {!isLoading && isAuthenticated && (
          <Modal>
            <Modal.Open opens="wallet">
              <span className="hover:bg-[#423566] px-4 py-2 rounded-md">
                <CiWallet size={26} />
              </span>
            </Modal.Open>
            <Modal.Body name="wallet">
              <Transaction />
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default MobileNavbar;
