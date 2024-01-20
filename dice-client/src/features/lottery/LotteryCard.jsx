import LobbyCard from "./lobby/LobbyCard";

function LotteryCard() {
  return (
    <div>
      <div className="gradient-lottery-card rounded-2xl px-8 py-4 space-y-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center md:items-start justify-between">
          <div className="lottery flex text-sm md:text-base space-x-1">
            <button className="active transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-4 py-1">
              Lobby
            </button>
            <button className="transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-4 py-1">
              My Tickets
            </button>
            <button className="transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-4 py-1">
              History
            </button>
          </div>
          <button className="button !bg-[#3e5eaf] text-sm md:text-base">
            Provably Fair
          </button>
        </div>

        {/* Lobby */}
        <LobbyCard />
      </div>
    </div>
  );
}

export default LotteryCard;
