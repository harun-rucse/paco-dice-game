import { AiOutlineHome } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiWallet } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import Modal from "./Modal";
import Transaction from "../features/transactions/Transaction";
import Authentication from "../features/authentication/Authentication";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

function MobileNavbar() {
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="block md:hidden fixed left-0 bottom-1 w-full z-[999999999] ">
      <div className="flex justify-between bg-[#493e64] px-4 py-3 m-2 text-white font-extralight rounded-2xl relative">
        {!isLoading && isAuthenticated ? (
          <>
            <div className="flex items-center gap-2">
              <div className="bg-[#695d89] border border-[#8377a3] shadow-md w-[3.5rem] h-[3.2rem] rounded-md flex justify-center items-center">
                <img src="/icons/ticket.png" alt="" className="w-10" />
              </div>
              <div className="bg-[#695d89] border border-[#8377a3] shadow-md w-[3.5rem] h-[3.2rem] rounded-md flex justify-center items-center">
                <img src="/icons/ticket.png" alt="" className="w-10" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 bg-[#695d89] w-[4rem] h-[4rem] rounded-full flex justify-center items-center">
              <IoMdMenu size={32} color="#a18ed2" />
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#695d89] border border-[#8377a3] shadow-md w-[3.5rem] h-[3.2rem] rounded-md flex justify-center items-center">
                <img src="/icons/ticket.png" alt="" className="w-10" />
              </div>
              <div className="bg-[#695d89] border border-[#8377a3] shadow-md w-[3.5rem] h-[3.2rem] rounded-md flex justify-center items-center">
                <img src="/icons/ticket.png" alt="" className="w-10" />
              </div>
            </div>
          </>
        ) : (
          <>
            <Modal>
              <Modal.Open opens="wallet">
                <button className="bg-[#695d89] hover:bg-[#423566] text-[#a996dd] text-lg border border-[#8377a3] px-6 py-2 rounded-lg shadow-lg">
                  Log in
                </button>
              </Modal.Open>
              <Modal.Body name="wallet">
                <Authentication />
              </Modal.Body>
            </Modal>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 bg-[#695d89] w-[4rem] h-[4rem] rounded-full flex justify-center items-center">
              <IoMdMenu size={32} color="#a18ed2" />
            </div>
            <Modal>
              <Modal.Open opens="wallet">
                <button className="bg-[#695d89] hover:bg-[#423566] text-[#a996dd] text-lg border border-[#8377a3] px-6 py-2 rounded-lg shadow-lg">
                  Register
                </button>
              </Modal.Open>
              <Modal.Body name="wallet">
                <Authentication />
              </Modal.Body>
            </Modal>
          </>
        )}

        {/* <NavLink
          to="/"
          className="bg-[#695d89] hover:bg-[#423566] px-4 py-2 rounded-md"
        >
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
        </NavLink> */}

        {/* {!isLoading && isAuthenticated && (
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
        )} */}
      </div>
    </div>
  );
}

export default MobileNavbar;
