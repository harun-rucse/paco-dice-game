import { useState } from "react";
import LobbyCard from "./lobby/LobbyCard";
import MyTickets from "./my-tickets/MyTickets";
import MyHistory from "./my-history/MyHistory";
import AllBets from "./all-bets/AllBets";
import AllTime from "./all-time/AllTime";
import { cn } from "../../utils";
import { useCurrentUser } from "../authentication/useCurrentUser";
import LotteryLogin from "./LotteryLogin";
import Modal from "../../components/Modal";

function LotteryCard() {
  const [tab, setTab] = useState("lobby");
  const { isAuthenticated, isLoading: isAuthLoading } = useCurrentUser();

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
            {!isAuthLoading && isAuthenticated && (
              <>
                <Modal>
                  <Modal.Open opens="my-tickets">
                    <button
                      className={cn(
                        "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                        tab === "my-tickets" && "active"
                      )}
                    >
                      My Tickets
                    </button>
                  </Modal.Open>
                  <Modal.Body
                    name="my-tickets"
                    className="bg-[#753d89] border border-[#955997] min-h-[28rem] md:min-h-[30rem] md:min-w-[36rem]"
                  >
                    <MyTickets />
                  </Modal.Body>
                </Modal>

                <button
                  className={cn(
                    "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                    tab === "my-history" && "active"
                  )}
                  onClick={() => setTab("my-history")}
                >
                  My History
                </button>
              </>
            )}

            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "all-bets" && "active"
              )}
              onClick={() => setTab("all-bets")}
            >
              All Bets
            </button>

            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "all-time" && "active"
              )}
              onClick={() => setTab("all-time")}
            >
              All Time
            </button>
          </div>
        </div>

        {!isAuthLoading && !isAuthenticated && tab !== "lobby" && (
          <LotteryLogin />
        )}

        {tab === "lobby" && <LobbyCard />}
        {!isAuthLoading && isAuthenticated && tab === "my-history" && (
          <MyHistory />
        )}
        {!isAuthLoading && isAuthenticated && tab === "all-bets" && <AllBets />}
        {!isAuthLoading && isAuthenticated && tab === "all-time" && <AllTime />}
      </div>
    </div>
  );
}

export default LotteryCard;
