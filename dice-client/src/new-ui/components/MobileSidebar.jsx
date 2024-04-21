import { Link, NavLink } from "react-router-dom";
import ToggleDarkMode from "./ToggleDarkMode";
import { useDarkMode } from "../../context/DarkModeContext";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const items = [
  {
    image: "/images/dice.png",
    title: "Dice",
    link: "/dice",
    isNew: false,
  },
  {
    image: "/images/ticket.png",
    title: "Lottery",
    link: "/lottery",
    isNew: false,
  },
  {
    image: "/images/money.png",
    title: "Staking",
    link: "/staking",
    isNew: false,
  },
  {
    image: "/images/referral.png",
    title: "Referral",
    link: "/referral",
    isNew: false,
  },
  {
    image: "/images/paco.png",
    title: "Faucet",
    link: "/faucet",
    isNew: true,
  },
];

function MobileSidebar({ open, setOpen }) {
  const { toggleDarkMode } = useDarkMode();
  const ref = useOutsideClick(() => setOpen(false));

  if (!open) return;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500/20 backdrop-blur-sm z-[999999]">
      <aside
        ref={ref}
        className="block desktop:hidden w-[14rem] h-max min-h-screen bg-[#24224a] dark:bg-[#1b152a] border-r border-[#444187] dark:border-[#40335f]"
      >
        <div className="flex items-center gap-4">
          <img src="/images/sidebar-logo.png" alt="" className="w-16" />
          <div className="flex flex-col items-center uppercase text-sm">
            <span>Play Lottery</span>
            <span className="text-[#c475f5]">Hit The Jackpot</span>
            <button className="bg-[#413e72] dark:bg-[#5b4675] rounded-xl px-4 py-1 uppercase mt-2">
              Buy a ticket
            </button>
          </div>
        </div>

        <ul className="space-y-3 py-8 px-2 sidebar">
          {items.map((item, i) => (
            <NavLink
              key={i}
              to={item.link}
              className="flex items-center gap-5 transition-all hover:bg-gradient-to-r from-[#5d4599] to-[#27254d] px-2 rounded-2xl relative"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-10 object-cover"
              />
              <span className="text-base">{item.title}</span>
              {item.isNew && (
                <span className="uppercase text-xs bg-[#322849] text-[#81cb88] px-4 py-1 rounded-2xl absolute top-3 right-0">
                  new
                </span>
              )}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-14">
          <Link to="https://t.me/PacoDeLlama" target="_blank">
            <img src="/images/telegram.png" alt="" className="w-7" />
          </Link>
          <Link to="https://twitter.com/pacodellamadefi" target="_blank">
            <img src="/images/twitter.png" alt="" className="w-7" />
          </Link>
        </div>

        <div className="flex justify-center items-center gap-4 py-6">
          <img src="/images/sun.png" alt="" className="w-8 object-cover" />
          <ToggleDarkMode onSwitch={(state) => toggleDarkMode(!state)} />
          <img src="/images/moon.png" alt="" className="w-8 object-cover" />
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;
