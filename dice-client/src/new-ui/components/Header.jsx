import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FiLogOut, FiUser } from "react-icons/fi";
import Modal from "./Modal";
import Transaction from "../features/transactions/Transaction";
import Authentication from "../features/authentication/Authentication";
import Balance from "./Balance";
import { useCurrentUser } from "../features/authentication/useCurrentUser";
import { useOutsideClick } from "../../hooks/useOutsideClick";

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

  return (
    <header className="p-0">
      <div className="flex items-center justify-between bg-[#241c38] px-3 py-2 border-b-2 border-[#5b4788]">
        <div className="flex items-center justify-center tablet:justify-stretch gap-4 w-full">
          <Link to="/">
            <img src="/icon.png" alt="Paco Dice" className="h-12 tablet:h-16" />
          </Link>
        </div>
        <div className="hidden tablet:flex items-center justify-end gap-6 w-full tablet:w-fit">
          {/* Balance button */}
          {!isLoading && isAuthenticated && <Balance />}

          {/* Wallet button */}
          {!isLoading && isAuthenticated && (
            <Modal>
              <Modal.Open opens="wallet">
                <button className="hidden tablet:flex items-center justify-between text-white gap-2 bg-[#d11f1f] rounded-2xl pl-2 pr-8 py-2 shadow-[0px_4px_4px_0px_#00000040]">
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
                className="flex items-center text-white gap-2 bg-[#3a2354] rounded-xl px-2 tablet:p-2 shadow-[0px_4px_4px_0px_#00000040]"
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
            <div className="flex items-center gap-6 pr-4">
              <Modal>
                <Modal.Open opens="authentication">
                  <button className="bg-[#4e3270] border-[#644689] border-2 rounded-2xl px-2 py-2 w-[8rem]">
                    <span className="font-extralight text-base">Sign in</span>
                  </button>
                </Modal.Open>
                <Modal.Body name="authentication">
                  <Authentication />
                </Modal.Body>
              </Modal>
              <Modal>
                <Modal.Open opens="authentication">
                  <button className="bg-[#4e3270] border-[#644689] border-2 rounded-2xl px-2 py-2 w-[8rem]">
                    <span className="font-extralight text-base">Sign up</span>
                  </button>
                </Modal.Open>
                <Modal.Body name="authentication">
                  <Authentication />
                </Modal.Body>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
