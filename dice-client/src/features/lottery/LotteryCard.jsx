import { useState } from "react";
import LobbyCard from "./lobby/LobbyCard";
import MyTickets from "./my-tickets/MyTickets";
import MyHistory from "./my-history/MyHistory";
import AllBets from "./all-bets/AllBets";
import { cn } from "../../utils";
import useGetMyTicketCount from "./useGetMyTicketsCount";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useCurrentUser } from "../authentication/useCurrentUser";
import LotteryLogin from "./LotteryLogin";

function LotteryCard() {
  const [tab, setTab] = useState("lobby");
  const { isLoading, ticketCount } = useGetMyTicketCount();
  const { isAuthenticated, isLoading: isAuthLoading } = useCurrentUser();

  if (isLoading) return <LoadingSpinner className="h-[8rem]" />;

  return (
    <div>
      <div className="gradient-lottery-card rounded-2xl px-4 md:px-8 py-4 space-y-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center md:items-start justify-between">
          <div className="lottery flex text-xs md:text-base space-x-1">
            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "lobby" && "active"
              )}
              onClick={() => setTab("lobby")}
            >
              Lobby
            </button>
            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "my-tickets" && "active"
              )}
              onClick={() => setTab("my-tickets")}
            >
              My Tickets
            </button>
            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "my-history" && "active"
              )}
              onClick={() => setTab("my-history")}
            >
              My History
            </button>
            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "all-bets" && "active"
              )}
              onClick={() => setTab("all-bets")}
            >
              All Bets
            </button>
          </div>
          {!isAuthLoading && isAuthenticated && (
            <div className="flex flex-col md:flex-row items-center gap-4">
              {tab === "my-tickets" && (
                <div className="my-lottery-bg text-sm md:text-base text-white px-6 md:px-8 py-2 rounded-3xl md:rounded-full">
                  <p>My Standard Tickets: {ticketCount?.totalStandardToken}</p>
                  <p>My Mega Tickets: {ticketCount?.totalMegaToken}</p>
                </div>
              )}
              <button className="button !bg-[#3e5eaf] text-sm md:text-base">
                Provably Fair
              </button>
            </div>
          )}
        </div>

        {!isAuthLoading && !isAuthenticated && tab !== "lobby" && (
          <LotteryLogin />
        )}

        {tab === "lobby" && <LobbyCard />}
        {!isAuthLoading && isAuthenticated && tab === "my-tickets" && (
          <MyTickets />
        )}
        {!isAuthLoading && isAuthenticated && tab === "my-history" && (
          <MyHistory />
        )}
        {!isAuthLoading && isAuthenticated && tab === "all-bets" && <AllBets />}
      </div>
    </div>
  );
}

export default LotteryCard;
