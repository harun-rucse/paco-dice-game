import { useState } from "react";
import LobbyCard from "./lobby/LobbyCard";
import MyTickets from "./my-tickets/MyTickets";
import MyHistory from "./my-history/MyHistory";
import AllBets from "./all-bets/AllBets";
import AllTime from "./all-time/AllTime";
import { cn } from "../../../utils";
import { useCurrentUser } from "../authentication/useCurrentUser";
import LotteryLogin from "./LotteryLogin";
import Modal from "../../components/Modal";

function LotteryCard() {
  const [tab, setTab] = useState("lobby");
  const { isAuthenticated, isLoading: isAuthLoading } = useCurrentUser();

  return (
    <div>
      <div className="bg-gradient-to-b from-[#302d5a] dark:from-[#532856] via-[#25234c] dark:via-[#341c3b] to-[#1d1b3f] dark:to-[#150f22] shadow-[0px_4px_4px_0px_#00000040] border-2 border-[#1c1a3e] dark:border-[#1f1329] rounded-2xl space-y-4 relative">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center md:items-start justify-between px-4 md:px-8 py-4">
          <div className="lottery flex text-xs md:text-base space-x-1">
            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#53508d] hover:dark:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "lobby" && "bg-[#53508d] dark:bg-[#90558e] border-black"
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
                        "transition text-white border border-transparent hover:bg-[#53508d] hover:dark:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                        tab === "my-tickets" &&
                          "bg-[#53508d] dark:bg-[#90558e] border-black"
                      )}
                    >
                      My Tickets
                    </button>
                  </Modal.Open>
                  <Modal.Body
                    name="my-tickets"
                    className="bg-gradient-to-b from-[#39366f] dark:from-[#8b4da1] via-[#2a2857] dark:via-[#69367b] to-[#24224a] dark:to-[#50285f] border border-[#24224a] dark:border-[#955997] min-h-[26rem] md:min-h-[30rem] md:min-w-[36rem]"
                  >
                    <MyTickets />
                  </Modal.Body>
                </Modal>

                <button
                  className={cn(
                    "transition text-white border border-transparent hover:bg-[#53508d] hover:dark:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                    tab === "my-history" &&
                      "bg-[#53508d] dark:bg-[#90558e] border-black"
                  )}
                  onClick={() => setTab("my-history")}
                >
                  My History
                </button>
              </>
            )}

            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#53508d] hover:dark:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "all-bets" &&
                  "bg-[#53508d] dark:bg-[#90558e] border-black"
              )}
              onClick={() => setTab("all-bets")}
            >
              All Bets
            </button>

            <button
              className={cn(
                "transition text-white border border-transparent hover:bg-[#53508d] hover:dark:bg-[#90558e] hover:border-black rounded-3xl px-2 md:px-4 py-1",
                tab === "all-time" &&
                  "bg-[#53508d] dark:bg-[#90558e] border-black"
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
