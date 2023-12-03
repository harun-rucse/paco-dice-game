import { NavLink, Link } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    image: "/icons/dashboard.png",
    href: "/admin/dashboard",
  },
  {
    title: "Staking",
    image: "/icons/staking-icon.png",
    href: "/admin/staking",
  },
  {
    title: "Approval",
    image: "/tokens/paco.png",
    href: "/admin/approval",
  },
  {
    title: "Events",
    image: "/icons/events.png",
    href: "/admin/events",
  },
  {
    title: "Lottery",
    image: "/icons/lottery.png",
    href: "/admin/lottery",
  },
  {
    title: "Users",
    image: "/icons/user.png",
    href: "/admin/users",
  },
  {
    title: "Withdrawables",
    image: "/tokens/paco.png",
    href: "/admin/withdrawables",
  },
];

function SidebarItem({ item }) {
  return (
    <NavLink
      to={item.href}
      className="flex px-3 py-1 rounded-lg items-center gap-4 border border-transparent"
    >
      <img src={item.image} alt="" className="w-8" />
      <span className="text-lg font-extralight">{item.title}</span>
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="bg-[#24292d] w-full h-full">
      <div>
        <Link to="/" className="flex flex-col items-center">
          <img src="/logo.png" alt="" className="w-28" />
          <img src="/logo2.png" alt="" className="w-32" />
        </Link>
        <div className="py-10 px-3 space-y-4">
          {items.map((item) => (
            <SidebarItem key={item.title} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
