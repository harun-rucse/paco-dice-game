import { Link, NavLink } from "react-router-dom";
import ToggleDarkMode from "./ToggleDarkMode";
import { useDarkMode } from "../../context/DarkModeContext";

const items = [
  {
    image: "/images/dice.png",
    title: "Dice",
    link: "/dice",
    subTitle: "",
  },
  {
    image: "/images/ticket.png",
    title: "Lottery",
    link: "/lottery",
    subTitle: "",
  },
  {
    image: "/images/money.png",
    title: "Staking",
    link: "/staking",
    subTitle: "",
  },
  {
    image: "/images/referral.png",
    title: "Referral",
    link: "/referral",
  },
  {
    image: "/images/paco.png",
    title: "Faucet",
    link: "/faucet",
    subTitle: "new",
    color: "text-[#81cb88]",
  },
  {
    image: "/images/swap-icon.png",
    title: "Swap",
    link: "/swap",
    subTitle: "soon",
    color: "text-[#f2bb68]",
  },
  {
    image: "/images/bridge-icon.png",
    title: "Bridge",
    link: "https://bridge.nerve.network/",
    isExternal: true,
    subTitle: "new",
    color: "text-[#81cb88]",
  },
  {
    image: "/images/news.png",
    title: "News",
    link: "/news",
    subTitle: "new",
    color: "text-[#81cb88]",
  },
];

function Sidebar() {
  const { toggleDarkMode } = useDarkMode();

  return (
    <aside className="hidden laptop:block fixed w-[21rem] laptop:w-[18rem] bg-[#24224a] dark:bg-[#1b152a] border-r border-[#444187] dark:border-[#40335f] tablet:h-[90vh] pb-8 desktop:h-screen overflow-y-auto">
      <div className="flex items-center gap-4">
        <img src="/images/sidebar-logo.png" alt="" className="w-20" />
        <div className="flex flex-col items-center uppercase">
          <span>Play Lottery</span>
          <span className="text-[#c475f5]">Hit The Jackpot</span>
          <Link to="/lottery">
            <button className="bg-[#413e72] dark:bg-[#5b4675] rounded-xl px-4 py-1 uppercase mt-2">
              Buy a ticket
            </button>
          </Link>
        </div>
      </div>

      <ul className="space-y-3 desktop:space-y-4 py-4 px-4 sidebar">
        {items.map((item, i) => (
          <NavLink
            key={i}
            to={item.link}
            target={item?.isExternal ? "_blank" : ""}
            className="flex items-center gap-5 transition-all hover:bg-gradient-to-r from-[#5d4599] to-[#27254d] px-2 rounded-2xl relative"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-12 object-cover"
            />
            <span className="text-lg">{item.title}</span>
            {item.subTitle && (
              <span
                className={`uppercase text-xs bg-[#322849] ${item.color} px-4 py-1 rounded-2xl absolute top-3 right-0`}
              >
                {item.subTitle}
              </span>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-14 py-2">
        <Link to="https://t.me/PacoDeLlama" target="_blank">
          <img src="/images/telegram.png" alt="" className="w-9" />
        </Link>
        <Link to="https://twitter.com/pacodellamadefi" target="_blank">
          <img src="/images/twitter.png" alt="" className="w-9" />
        </Link>
      </div>

      <div className="flex justify-center items-center gap-4 py-2">
        <img src="/images/sun.png" alt="" className="w-10 object-cover" />
        <ToggleDarkMode onSwitch={(state) => toggleDarkMode(!state)} />
        <img src="/images/moon.png" alt="" className="w-10 object-cover" />
      </div>
    </aside>
  );
}

export default Sidebar;
