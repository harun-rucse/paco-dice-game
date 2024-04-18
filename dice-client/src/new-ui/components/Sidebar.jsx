import { Link, NavLink } from "react-router-dom";
import ToggleDarkMode from "./ToggleDarkMode";

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

function Sidebar() {
  return (
    <aside className="w-[19rem] bg-[#1b152a] border-r border-[#40335f]">
      <div className="flex items-center gap-4">
        <img src="/images/sidebar-logo.png" alt="" className="w-20" />
        <div className="flex flex-col items-center uppercase">
          <span>Play Lottery</span>
          <span className="text-[#c475f5]">Hit The Jackpot</span>
          <button className="bg-[#5b4675] rounded-xl px-4 py-1 uppercase mt-2">
            Buy a ticket
          </button>
        </div>
      </div>

      <ul className="space-y-4 py-8 px-4">
        {items.map((item, i) => (
          <NavLink
            key={i}
            to={item.link}
            className="flex items-center gap-5 transition-all hover:bg-[#241c38] px-2 rounded-md relative"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-12 object-cover"
            />
            <span className="text-lg">{item.title}</span>
            {item.isNew && (
              <span className="uppercase text-xs bg-[#322849] text-[#81cb88] px-4 py-1 rounded-2xl absolute top-3 right-0">
                new
              </span>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-14 py-4">
        <Link to="https://t.me/PacoDeLlama" target="_blank">
          <img src="/images/telegram.png" alt="" className="w-9" />
        </Link>
        <Link to="https://twitter.com/pacodellamadefi" target="_blank">
          <img src="/images/twitter.png" alt="" className="w-9" />
        </Link>
      </div>

      <div className="flex justify-center items-center gap-4 py-6">
        <img src="/images/sun.png" alt="" className="w-10 object-cover" />
        <ToggleDarkMode onSwitch={() => {}} />
        <img src="/images/moon.png" alt="" className="w-10 object-cover" />
      </div>
    </aside>
  );
}

export default Sidebar;
