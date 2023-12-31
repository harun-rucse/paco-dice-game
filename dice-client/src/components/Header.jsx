import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FiLogOut, FiLogIn, FiUser } from "react-icons/fi";
import Modal from "./Modal";
import Transaction from "../features/transactions/Transaction";
import Authentication from "../features/authentication/Authentication";
import Balance from "./Balance";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import { useOutsideClick } from "../hooks/useOutsideClick";

function Header() {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, user, isLoading } = useCurrentUser();
  const ref = useOutsideClick(() => setShowMenu(false));

  function handleLogout() {
    localStorage.removeItem("jwt-token");
    queryClient.removeQueries();
    window.location.reload();
  }

  // if (isLoading) return <Spinner />;

  return (
    <header className="p-0">
      <div className="flex items-center justify-between bg-[#432663] px-3 shadow-[0px_4px_4px_0px_#00000040]">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img
              src="/icon.png"
              alt="Paco Dice"
              className="hidden md:block h-10 md:h-16"
            />
          </Link>
          <div className="hidden md:flex items-center gap-7 h-fit px-4 py-2 rounded-2xl ">
            <Link to="/">
              <button className="button flex gap-2 items-center !px-4 !py-2">
                <img src="/icons/games.png" alt="" className="w-5 lg:w-6" />
                <span className="uppercase text-sm lg:text-base font-extralight">
                  Games
                </span>
              </button>
            </Link>
            <Link to="/staking">
              <button className="button flex gap-2 items-center !px-4 !py-2">
                <img src="/icons/staking.png" alt="" className="w-5 lg:w-6" />
                <span className="uppercase text-sm lg:text-base font-extralight">
                  Staking
                </span>
              </button>
            </Link>
            <Link
              to="https://www.dexview.com/bsc/0xe1d0065c4cd16C14C539547bac404cA6F586b8ce"
              target="_blank"
            >
              <button className="button flex gap-2 items-center !px-4 !py-2">
                <img src="/icons/trade.png" alt="" className="w-5 lg:w-6" />
                <span className="uppercase text-sm lg:text-base font-extralight">
                  Trade
                </span>
              </button>
            </Link>
          </div>
          <img src="/icons/ticket.png" alt="" className="h-12 mr-6 md:mr-0" />
        </div>
        <div className="flex items-center justify-end gap-2 w-full md:w-fit">
          {/* Balance button */}
          {!isLoading && isAuthenticated && <Balance />}

          {/* Wallet button */}
          {!isLoading && isAuthenticated && (
            <Modal>
              <Modal.Open opens="wallet">
                <button className="hidden md:flex items-center justify-between text-white gap-2 bg-[#d11f1f] rounded-2xl px-4 py-2 shadow-[0px_4px_4px_0px_#00000040]">
                  <img src="/icons/wallet.png" alt="" className="h-7 pt-1" />
                  <span className="uppercase font-extralight text-base">
                    Wallet
                  </span>
                </button>
              </Modal.Open>
              <Modal.Body name="wallet">
                <Transaction />
              </Modal.Body>
            </Modal>
          )}

          {/* Login/Register */}

          {!isLoading && isAuthenticated ? (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setShowMenu((show) => !show)}
                className="flex items-center text-white gap-2 bg-[#2e2550] rounded-xl px-2 md:p-2 shadow-[0px_4px_4px_0px_#00000040]"
              >
                <div className="w-8 h-8 rounded-full bg-[#d11f9f] flex justify-center items-center">
                  <img src="/slider-img.png" alt="" className="h-7" />
                </div>
                <MdOutlineKeyboardArrowDown size={20} />
              </button>

              {showMenu && (
                <div className="absolute w-[10rem] top-12 right-0 bg-[#3c2f61] p-2 rounded-2xl space-y-3 z-[999] shadow-md">
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-white cursor-pointer border-b pb-2 border-gray-600 px-2 uppercase text-sm font-extralight flex items-center gap-2"
                    >
                      <FiLogOut />
                      Admin Panel
                    </Link>
                  )}

                  {isAuthenticated && (
                    <Link
                      to="/profile"
                      className="text-white cursor-pointer border-b pb-2 border-gray-600 px-2 uppercase text-sm font-extralight flex items-center gap-2"
                    >
                      <FiUser />
                      Profile
                    </Link>
                  )}
                  <span
                    onClick={handleLogout}
                    className="text-white cursor-pointer px-2 uppercase text-sm font-extralight flex items-center gap-2"
                  >
                    <FiLogOut />
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Modal>
              <Modal.Open opens="authentication">
                <button className="items-center text-white gap-2 bg-[#2e2550] rounded-xl px-2 md:px-8 py-1 md:py-2 shadow-[0px_4px_4px_0px_#00000040]">
                  <span className="uppercase font-extralight text-base flex items-center gap-2">
                    <FiLogIn />
                    Login
                  </span>
                </button>
              </Modal.Open>
              <Modal.Body name="authentication">
                <Authentication />
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
