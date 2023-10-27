import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

function BalanceItem({ name, value, imgUrl, onSelect, onHide }) {
  return (
    <div
      onClick={() => {
        onSelect({ name, imgUrl, value });
        onHide(false);
      }}
      className="flex items-center justify-between bg-[#4d316c] transition-all hover:scale-105 px-3 py-1 rounded-lg cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <img src={imgUrl} alt="" className="h-7" />
        <strong className="text-gray-300 font-extrabold">{name}</strong>
      </div>
      <strong className="text-white font-extrabold">{value}</strong>
    </div>
  );
}

function Header() {
  const [showBalance, setShowBalance] = useState(false);
  const [currentBalance, setCurrentBalance] = useState({
    name: "BTC",
    value: "0.10189005",
    imgUrl: "/tokens/btc.png",
  });

  return (
    <header className="p-0">
      <div className="flex items-center justify-between bg-[#432663] px-3 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <img
              src="/icon.png"
              alt="Paco Dice"
              className="hidden md:block h-10 md:h-16"
            />
          </Link>
          <div className="hidden md:flex items-center gap-7 bg-[#2e2550] h-fit px-4 py-2 rounded-2xl shadow-[0px_4px_4px_0px_#00000040]">
            <Link to="/">
              <button className="flex items-center gap-2 text-white">
                <img src="/icons/games.png" alt="" className="h-7" />
                <span className="text-base font-extrabold uppercase mt-1">
                  Games
                </span>
              </button>
            </Link>
            <Link to="/staking">
              <button className="flex items-center gap-2 text-white">
                <img src="/icons/staking.png" alt="" className="h-7" />
                <span className="text-base font-extrabold uppercase">
                  Staking
                </span>
              </button>
            </Link>
            <Link to="/trade">
              <button className="flex items-center gap-2 text-white">
                <img src="/icons/trade.png" alt="" className="h-7" />
                <span className="text-base font-extrabold uppercase">
                  Trade
                </span>
              </button>
            </Link>
          </div>
          <img src="/icons/ticket.png" alt="" className="h-12 mr-6 md:mr-0" />
        </div>
        <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-fit">
          {/* Balance button */}
          <div className="relative">
            <button
              onClick={() => setShowBalance((show) => !show)}
              className="flex items-center justify-between text-white gap-2 bg-[#2e2550] rounded-2xl px-2 md:px-4 py-1 md:py-2 shadow-[0px_4px_4px_0px_#00000040]"
            >
              <img src={currentBalance.imgUrl} alt="" className="h-6 md:h-7" />
              <span className="uppercase font-extrabold text-sm md:text-base">
                {currentBalance.value}
              </span>
              <MdOutlineKeyboardArrowDown />
            </button>

            {showBalance && (
              <div className="absolute w-[18rem] top-12 left-0 bg-[#3c2f61] p-2 rounded-2xl space-y-2 z-[999] shadow-md">
                <BalanceItem
                  name="BTC"
                  value="0.10189005"
                  imgUrl="/tokens/btc.png"
                  onHide={setShowBalance}
                  onSelect={setCurrentBalance}
                />

                <BalanceItem
                  name="USDT"
                  value="0.10189005"
                  imgUrl="/tokens/usdt.png"
                  onHide={setShowBalance}
                  onSelect={setCurrentBalance}
                />

                <BalanceItem
                  name="PACO"
                  value="0.10189005"
                  imgUrl="/tokens/paco.png"
                  onHide={setShowBalance}
                  onSelect={setCurrentBalance}
                />

                <BalanceItem
                  name="ETH"
                  value="0.10189005"
                  imgUrl="/tokens/eth.png"
                  onHide={setShowBalance}
                  onSelect={setCurrentBalance}
                />

                <BalanceItem
                  name="BNB"
                  value="0.10189005"
                  imgUrl="/tokens/bnb.png"
                  onHide={setShowBalance}
                  onSelect={setCurrentBalance}
                />
              </div>
            )}
          </div>

          {/* Wallet button */}
          <button className="hidden md:flex items-center justify-between text-white gap-2 bg-[#d11f1f] rounded-2xl px-4 py-2 shadow-[0px_4px_4px_0px_#00000040]">
            <img src="/icons/wallet.png" alt="" className="h-7 pt-1" />
            <span className="uppercase font-extrabold text-base">Wallet</span>
          </button>

          {/* Connect wallet */}
          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => {
              return (
                <button
                  onClick={show}
                  className={
                    isConnected &&
                    "hidden md:block bg-[#2e2550] text-white text-sm md:text-base font-extrabold px-2 md:px-4 py-1 md:py-2 rounded-2xl shadow-[0px_4px_4px_0px_#00000040]"
                  }
                >
                  {isConnected ? (
                    address.slice(0, 6) + "..." + address.slice(-4)
                  ) : (
                    <button className="hidden md:flex items-center text-white gap-2 bg-[#2e2550] rounded-2xl px-2 md:px-4 py-1 md:py-2 shadow-[0px_4px_4px_0px_#00000040]">
                      <span className="uppercase font-extrabold text-sm md:text-base">
                        Connect
                      </span>
                      <img src="/icons/metamask.png" alt="" className="h-6" />
                    </button>
                  )}
                </button>
              );
            }}
          </ConnectKitButton.Custom>
          {/* <Link to="/login" className="hidden md:block">
            <button className="flex items-center text-white gap-2 bg-[#2e2550] rounded-2xl px-8 py-2 shadow-[0px_4px_4px_0px_#00000040]">
              <span className="uppercase font-extrabold text-base">Login</span>
            </button>
          </Link> */}
          <button className="flex items-center text-white gap-2 bg-[#2e2550] rounded-2xl p-2 shadow-[0px_4px_4px_0px_#00000040]">
            <div className="w-8 h-8 rounded-full bg-[#d11f9f] flex justify-center items-center">
              <img src="/slider-img.png" alt="" className="h-7" />
            </div>
            <MdOutlineKeyboardArrowDown size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
