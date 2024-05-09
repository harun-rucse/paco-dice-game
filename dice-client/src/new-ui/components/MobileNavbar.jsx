import { IoMdMenu } from "react-icons/io";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import Transaction from "../features/transactions/Transaction";
import Authentication from "../features/authentication/Authentication";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";

function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div className="block tablet:hidden fixed left-0 bottom-1 w-full z-[999999999]">
      <div className="flex justify-between bg-[#413e72] dark:bg-[#493e64] px-4 py-3 m-2 text-white font-extralight rounded-2xl relative">
        {!isLoading && isAuthenticated ? (
          <>
            <div className="flex items-center gap-2">
              <div className="bg-[#5d58a1] dark:bg-[#493e64] border border-[#8377a3] shadow-md w-[3.5rem] h-[3rem] rounded-md flex justify-center items-center">
                <Link to="/dice">
                  <img src="/images/dice.png" alt="" className="w-8" />
                </Link>
              </div>
              <div className="bg-[#5d58a1] dark:bg-[#493e64] border border-[#8377a3] shadow-md w-[3.5rem] h-[3rem] rounded-md flex justify-center items-center">
                <Link to="/lottery">
                  <img src="/images/ticket.png" alt="" className="w-8" />
                </Link>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 bg-[#5d58a1] border border-[#8377a3] dark:bg-[#493e64] w-[4rem] h-[4rem] rounded-full flex justify-center items-center">
              <Modal>
                <Modal.Open opens="wallet">
                  <img src="/images/wallet.png" alt="" className="w-8" />
                </Modal.Open>
                <Modal.Body name="wallet">
                  <Transaction />
                </Modal.Body>
              </Modal>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#5d58a1] dark:bg-[#493e64] border border-[#8377a3] shadow-md w-[3.5rem] h-[3rem] rounded-md flex justify-center items-center">
                <Link to="/staking">
                  <img src="/images/money.png" alt="" className="w-8" />
                </Link>
              </div>
              <div
                className="bg-[#5d58a1] dark:bg-[#493e64] border border-[#8377a3] shadow-md w-[3.5rem] h-[3rem] rounded-md flex justify-center items-center"
                onClick={() => setOpen((state) => !state)}
              >
                <img src="/images/menu.png" alt="" className="w-8" />
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
              <IoMdMenu
                size={32}
                color="#a18ed2"
                onClick={() => setOpen((state) => !state)}
              />
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

        <MobileSidebar open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}

export default MobileNavbar;
